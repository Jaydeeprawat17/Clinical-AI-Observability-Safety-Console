import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export const SkeletonStyleCard = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{ height: 120, width: '100%', borderRadius: 20, marginBottom: 12 }} />
    </SkeletonPlaceholder>
  );
};
