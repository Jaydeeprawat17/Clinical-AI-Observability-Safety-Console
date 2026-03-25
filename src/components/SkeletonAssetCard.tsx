import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export const SkeletonAssetCard = () => {
  return (
    <SkeletonPlaceholder>
      <View className="gap-4 mb-6">
        {/* Image skeleton */}
        <View className="rounded-3xl overflow-hidden" style={{ height: 320, width: '100%' }} />

        {/* Title and subtitle skeleton */}
        <View className="px-2 gap-2">
          <View style={{ height: 20, width: '60%', borderRadius: 4 }} />
          <View style={{ height: 14, width: '40%', borderRadius: 4 }} />
        </View>

        {/* Buttons skeleton */}
        <View className="px-2 flex-row gap-2 justify-end">
          <View style={{ height: 40, width: 40, borderRadius: 20 }} />
          <View style={{ height: 40, width: 40, borderRadius: 20 }} />
          <View style={{ height: 40, width: 40, borderRadius: 20 }} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};
