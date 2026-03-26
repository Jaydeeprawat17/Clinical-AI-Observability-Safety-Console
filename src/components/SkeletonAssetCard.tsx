import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';

export const SkeletonAssetCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageSkeletons} />
      <View style={styles.textContainer}>
        <View style={styles.titleSkeleton} />
        <View style={styles.subtitleSkeleton} />
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonSkeleton} />
        <View style={styles.buttonSkeleton} />
        <View style={styles.buttonSkeleton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  imageSkeletons: {
    height: 320,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(42, 42, 53, 0.75)',
  },
  textContainer: {
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  titleSkeleton: {
    height: 20,
    width: '60%',
    borderRadius: 4,
    backgroundColor: 'rgba(42, 42, 53, 0.8)',
  },
  subtitleSkeleton: {
    height: 14,
    width: '40%',
    borderRadius: 4,
    backgroundColor: 'rgba(42, 42, 53, 0.7)',
  },
  buttonsContainer: {
    paddingHorizontal: theme.spacing.sm,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'flex-end',
  },
  buttonSkeleton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(42, 42, 53, 0.8)',
  },
});
