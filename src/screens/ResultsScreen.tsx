import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export default function ResultsScreen() {
  const { results, isGenerating, uploadedImage } = useAppStore();

  const downloadImage = async (uri: string, style: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('✅ Saved!', `Clipart (${style}) saved to your Gallery`);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not save image');
    }
  };

  const shareImage = async (uri: string) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert('Sharing not available');
    }
  };

  if (isGenerating) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Generating 5 styles in parallel...</Text>
        <View style={styles.grid}>
          {Array(5).fill(0).map((_, i) => (
            <LocalSkeletonLoader key={i} />
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Your AI Clipart Styles</Text>

      {/* Before / After section (bonus) */}
      {uploadedImage && (
        <View style={styles.beforeAfterCard}>
          <Text style={styles.beforeAfterLabel}>Original vs Clipart</Text>
          <View style={styles.beforeAfterRow}>
            <Image source={{ uri: uploadedImage }} style={styles.beforeAfterImage} />
            <Image source={{ uri: results[0]?.image }} style={styles.beforeAfterImage} />
          </View>
        </View>
      )}

      <View style={styles.grid}>
        {results.map((result, index) => (
          <View key={index} style={styles.card}>
            <Image
              source={{ uri: result.image }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <Text style={styles.cardTitle}>{result.style}</Text>

            <View style={styles.cardActions}>
              <TouchableOpacity
                onPress={() => downloadImage(result.image, result.style)}
                style={[styles.actionButton, styles.actionButtonPrimary]}
                activeOpacity={0.85}
              >
                <Text style={styles.actionButtonText}>⬇️ Download</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => shareImage(result.image)}
                style={[styles.actionButton, styles.actionButtonSecondary]}
                activeOpacity={0.85}
              >
                <Text style={styles.actionButtonText}>↗️ Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function LocalSkeletonLoader() {
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonTitle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  beforeAfterCard: {
    marginBottom: 32,
    backgroundColor: '#27272a',
    borderRadius: 24,
    padding: 16,
  },
  beforeAfterLabel: {
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 12,
  },
  beforeAfterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  beforeAfterImage: {
    width: '48%',
    height: 224,
    borderRadius: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: '48%',
    backgroundColor: '#27272a',
    borderRadius: 24,
    padding: 12,
  },
  cardImage: {
    width: '100%',
    height: 256,
    borderRadius: 16,
  },
  cardTitle: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 12,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
  },
  actionButtonPrimary: {
    backgroundColor: '#2563eb',
  },
  actionButtonSecondary: {
    backgroundColor: '#3f3f46',
  },
  actionButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  skeletonContainer: {
    width: '48%',
    backgroundColor: '#27272a',
    borderRadius: 24,
    padding: 12,
  },
  skeletonImage: {
    width: '100%',
    height: 256,
    backgroundColor: '#3f3f46',
    borderRadius: 16,
  },
  skeletonTitle: {
    height: 16,
    backgroundColor: '#3f3f46',
    borderRadius: 8,
    marginTop: 16,
    width: '75%',
    alignSelf: 'center',
  },
});