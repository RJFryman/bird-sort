// Celebrates a completed puzzle with earned discoveries, while leaving stopping and replay free.
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bird } from './Bird';
import { COLLECTIONS, CollectionId } from './roster';

export function WinCelebration({ collection, species, newCount, total, reducedMotion, onNext, onJournal, onClose, onRest }: {
  collection: CollectionId; species: number[]; newCount: number; total: number; reducedMotion: boolean;
  onNext: () => void; onJournal: () => void; onClose: () => void; onRest: () => void;
}) {
  return <View style={styles.backdrop} accessibilityViewIsModal>
    <ScrollView style={styles.sheet} contentContainerStyle={styles.content}>
      <Text style={styles.stars}>✦ ★ ✦</Text>
      <Text accessibilityRole="header" style={styles.title}>You brought everyone together!</Text>
      <Text style={styles.sub}>{newCount ? `${newCount} new ${newCount === 1 ? 'sticker' : 'stickers'} for your journal` : 'Another beautiful puzzle solved'}</Text>
      <View style={styles.flock}>{species.slice(0, 4).map(id => <View key={id} style={styles.sticker}>
        <Bird species={id} collection={collection} scale={1.2} dancing={!reducedMotion} />
        <Text style={styles.name}>{COLLECTIONS[collection][id].name}</Text>
        <Text style={styles.check}>★</Text>
      </View>)}</View>
      <Text style={styles.sub}>{total} / {COLLECTIONS[collection].length} discoveries earned</Text>
      <Pressable accessibilityRole="button" style={styles.primary} onPress={onNext}><Text style={styles.primaryText}>Next level →</Text></Pressable>
      <Pressable accessibilityRole="button" style={styles.secondary} onPress={onJournal}><Text style={styles.secondaryText}>★ Open my journal</Text></Pressable>
      <Pressable accessibilityRole="button" style={styles.secondary} onPress={onClose}><Text style={styles.secondaryText}>Look at my solved puzzle</Text></Pressable>
      <Pressable accessibilityRole="button" style={styles.secondary} onPress={onRest}><Text style={styles.secondaryText}>All done for now ✓</Text></Pressable>
      <Text style={styles.rest}>Your discoveries stay safe when you take a break.</Text>
    </ScrollView>
  </View>;
}
const styles = StyleSheet.create({
  backdrop:{position:'absolute',inset:0,backgroundColor:'rgba(27,55,45,.62)',alignItems:'center',justifyContent:'center',padding:16},
  sheet:{maxWidth:520,width:'100%',maxHeight:'95%',backgroundColor:'#fffdf2',borderRadius:28},
  content:{padding:22,alignItems:'center',gap:12},stars:{fontSize:38,color:'#b5791a',letterSpacing:12},
  title:{fontSize:27,fontWeight:'900',color:'#244b39',textAlign:'center'},sub:{fontSize:16,color:'#486453',textAlign:'center'},
  flock:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:8},sticker:{width:96,alignItems:'center',padding:8,borderRadius:20,backgroundColor:'#edf1db',borderWidth:2,borderColor:'#d3b768'},
  name:{fontSize:12,fontWeight:'700',color:'#244b39',textAlign:'center'},check:{color:'#9b6a16',fontSize:20},
  primary:{minHeight:54,width:'100%',backgroundColor:'#2d694d',borderRadius:18,justifyContent:'center',alignItems:'center'},primaryText:{fontSize:19,color:'#fffdf3',fontWeight:'800'},
  secondary:{minHeight:48,width:'100%',borderRadius:16,borderWidth:1,borderColor:'#b9c9ae',justifyContent:'center',alignItems:'center',paddingHorizontal:10},secondaryText:{fontSize:16,fontWeight:'700',color:'#2d573f'},
  rest:{fontSize:13,color:'#526959',textAlign:'center'},
});
