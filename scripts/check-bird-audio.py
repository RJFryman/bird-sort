#!/usr/bin/env python3
"""Asset-authoring check: FFmpeg + installed NumPy; never runs inside the app.
Writes hash-bound measurements for Jest with --write, and fails bad audio levels.
A spectral heuristic does not certify bird identity or replace a listening pass.
"""
import argparse, hashlib, json, math, pathlib, re, subprocess
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent

def inspect(record):
    key = record['asset']
    file = ROOT / ('assets/sfx/cardinal-call.mp3' if key == 'cardinal' else f'assets/sfx/birds/{key}.mp3')
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(file), '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'])
    a = np.frombuffer(raw, dtype=np.float32)
    windows = np.array([np.mean(a[i:i+1600] ** 2) for i in range(0, len(a), 1600)])
    levels = 10 * np.log10(np.maximum(windows, 1e-16))
    # Look inside the bird's retained frequency band, rather than counting a
    # bandpass filter's empty high-frequency bins as evidence of a tonal call.
    frames = np.lib.stride_tricks.sliding_window_view(a, 512)[::256] * np.hanning(512)
    spectrum = np.abs(np.fft.rfft(frames)) ** 2
    frequencies = np.fft.rfftfreq(512, 1 / 16000)
    low = 80 if key == 'bubo-virginianus' else 300
    high = 1800 if key in ['bubo-virginianus', 'zenaida-macroura'] else 7000
    band = spectrum[:, (frequencies >= low) & (frequencies <= high)]
    concentration = np.max(band, axis=1) / np.maximum(np.sum(band, axis=1), 1e-20)
    report = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(file), '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True, check=True).stderr
    integrated = float(re.findall(r'I:\s*(-?[\d.]+) LUFS', report)[-1])
    return {
        'asset': key, 'sha256': hashlib.sha256(file.read_bytes()).hexdigest(),
        'decodedDuration': len(a) / 16000, 'integratedLufs': integrated,
        'loudest100msDbfs': float(np.max(levels)), 'windowContrastDb': float(np.max(levels) - np.percentile(levels, 20)),
        'tonalConcentration90': float(np.percentile(concentration, 90)),
        'peakDbfs': 20 * math.log10(max(float(np.max(np.abs(a))), 1e-12)),
    }

def main():
    parser = argparse.ArgumentParser(); parser.add_argument('--write', action='store_true'); args = parser.parse_args()
    records = json.loads((ROOT / 'bird-recordings.json').read_text())
    measurements = [inspect(record) for record in {record['asset']: record for record in records}.values()]
    failures = []
    for item in measurements:
        reasons = []
        if not -23 <= item['integratedLufs'] <= -17: reasons.append('integrated loudness outside -23..-17 LUFS')
        if item['loudest100msDbfs'] < -24: reasons.append('100ms loudness below -24 dBFS')
        if item['peakDbfs'] > -1: reasons.append('peak above -1 dBFS')
        if item['windowContrastDb'] < 8 and item['tonalConcentration90'] < .1: reasons.append('low dynamics and no strong tonal structure')
        if reasons: failures.append({'asset': item['asset'], 'reasons': reasons})
    path = ROOT / 'bird-audio-measurements.json'
    if args.write: path.write_text(json.dumps(measurements, indent=2) + '\n')
    print(json.dumps({'clips': len(measurements), 'integratedRange': [min(m['integratedLufs'] for m in measurements), max(m['integratedLufs'] for m in measurements)], 'failures': failures}, indent=2))
    raise SystemExit(bool(failures))

if __name__ == '__main__': main()
