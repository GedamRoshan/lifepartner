import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';

export const DecorativeBackground = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={styles.base} />
    <View style={styles.blobTop} />
    <View style={styles.blobBottom} />
  </View>
);

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colors.backgroundSoft,
  },
  blobTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: theme.colors.primaryMuted,
  },
  blobBottom: {
    position: 'absolute',
    bottom: -40,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: theme.colors.secondaryMuted,
  },
});
