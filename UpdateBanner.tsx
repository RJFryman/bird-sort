import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

// A friendly, opt-in "an update is available" notifier.
//
// When a new version is deployed, players see a small banner and TAP to get it —
// never a forced auto-refresh. State persists across reload, so tapping resumes
// the player exactly where they were.
//
// How it works: every web build stamps a fresh /version.json (see
// scripts/stamp-version.mjs). On mount we fetch it and remember the booted build
// id. We re-check on tab/app refocus and on an interval; when the fetched id
// differs from the booted one, a new build is live and we surface the banner.
//
// Reusable: web-guarded, SSR-safe, no app-specific logic beyond palette styling.
// Drop <UpdateBanner /> once near the root of any Pages app.

const VERSION_URL = '/version.json';
const CHECK_INTERVAL_MS = 150_000; // ~2.5 min

const isWeb =
  Platform.OS === 'web' &&
  typeof window !== 'undefined' &&
  typeof document !== 'undefined';

async function fetchBuildId(): Promise<string | null> {
  if (!isWeb || typeof fetch === 'undefined') return null;
  try {
    // Cache-bust so a stale CDN/browser copy can't hide a fresh deploy.
    const res = await fetch(`${VERSION_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    const build = data && data.build;
    return typeof build === 'string' && build.length > 0 ? build : null;
  } catch {
    // Offline / transient error — just try again on the next check.
    return null;
  }
}

export default function UpdateBanner() {
  const bootedBuild = useRef<string | null>(null);
  const [updateReady, setUpdateReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const check = useCallback(async () => {
    const latest = await fetchBuildId();
    if (!latest) return;
    if (bootedBuild.current === null) {
      // First successful read is our baseline — the build we booted on.
      bootedBuild.current = latest;
      return;
    }
    if (latest !== bootedBuild.current) setUpdateReady(true);
  }, []);

  useEffect(() => {
    if (!isWeb) return;

    void check();

    const onVisible = () => {
      if (document.visibilityState === 'visible') void check();
    };
    document.addEventListener('visibilitychange', onVisible);
    const interval = setInterval(() => void check(), CHECK_INTERVAL_MS);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(interval);
    };
  }, [check]);

  if (!isWeb || !updateReady || dismissed) return null;

  const apply = () => {
    // State persists (localStorage), so a reload is non-destructive: the player
    // resumes where they were, now on the new build. Cache-bust the navigation —
    // a plain reload() re-serves the cached bundle in an iOS home-screen PWA.
    if (!isWeb) return;
    const u = new URL(window.location.href);
    u.searchParams.set('v', String(Date.now()));
    window.location.replace(u.toString());
  };

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable style={styles.card} onPress={apply} accessibilityRole="button">
        <Text style={styles.text} pointerEvents="none">
          ✨ New! Tap to update
        </Text>
        <Pressable
          style={styles.close}
          onPress={() => setDismissed(true)}
          hitSlop={12}
          accessibilityRole="button"
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    zIndex: 60,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#ffb74d',
    paddingVertical: 12,
    paddingLeft: 18,
    paddingRight: 10,
    shadowColor: '#c98a3a',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  text: { fontSize: 18, fontWeight: '800', color: '#e65100' },
  close: {
    marginLeft: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 18, color: '#e65100', fontWeight: '800' },
});
