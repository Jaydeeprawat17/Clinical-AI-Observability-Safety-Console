import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function SkeletonLoader() {
  return (
    <View style={styles.container}>
      <View style={styles.image} />
      <View style={styles.title} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: '#27272a',
    borderRadius: 24,
    padding: 12,
  },
  image: {
    width: '100%',
    height: 256,
    backgroundColor: '#3f3f46',
    borderRadius: 16,
  },
  title: {
    height: 16,
    backgroundColor: '#3f3f46',
    borderRadius: 8,
    marginTop: 16,
    width: '75%',
    alignSelf: 'center',
  },
})