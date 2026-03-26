import React from 'react'
import { View } from 'react-native'

export default function SkeletonLoader() {
  return (
    <View className="w-[48%] bg-zinc-800 rounded-3xl p-3 animate-pulse">
      <View className="w-full h-64 bg-zinc-700 rounded-2xl" />
      <View className="h-4 bg-zinc-700 rounded mt-4 w-3/4 mx-auto" />
    </View>
  )
}