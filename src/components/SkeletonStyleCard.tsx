import React from 'react';
import { View } from 'react-native';

export const SkeletonStyleCard = () => {
  return (
    <View
      style={{
        height: 120,
        width: '100%',
        borderRadius: 20,
        marginBottom: 12,
        backgroundColor: 'rgba(42, 42, 53, 0.75)',
      }}
    />
  );
};
