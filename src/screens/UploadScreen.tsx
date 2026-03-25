import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const UploadScreen = ({ navigation }: any) => {
  const [selectedStyle, setSelectedStyle] = useState('minimalist');
  const [isLoading, setIsLoading] = useState(false);

  const handleCameraPress = () => {
    console.log('Camera button pressed');
  };

  const handleLibraryPress = () => {
    console.log('Library button pressed');
  };

  const handleGeneratePress = () => {
    console.log('Generate Clipart button pressed');
  };

  const styles = [
    {
      id: 'minimalist',
      name: 'Minimalist Vector',
      description: 'Clean lines & flat colors',
      icon: 'brush',
    },
    {
      id: '3d-claymorphism',
      name: '3D Claymorphism',
      description: 'Soft shadows & matte depth',
      icon: 'deployed_code',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-2 border-b border-outline-variant/10">
        <View className="flex-row items-center gap-3">
          <MaterialIcons name="auto_awesome" size={24} color="#06b6d4" />
          <Text className="font-headline font-bold text-xl tracking-tight text-cyan-400">
            Digital Curator
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="mt-8 mb-8">
          <Text className="font-headline text-5xl font-bold tracking-tight mb-2 text-on-background">
            Transform{' '}
            <Text className="bg-gradient-to-br from-primary to-secondary">Reality.</Text>
          </Text>
          <Text className="text-on-surface-variant text-sm max-w-xs">
            Upload your inspiration and let our AI curate high-end vector clipart for your next
            masterpiece.
          </Text>
        </View>

        {/* Upload Area */}
        <View className="mb-8 rounded-3xl p-6 border-2 border-dashed border-primary/30 bg-surface-container-low justify-center items-center py-12">
          <MaterialIcons name="cloud_upload" size={48} color="#8ff5ff" style={{ marginBottom: 24 }} />
          <Text className="font-headline text-2xl font-bold mb-2 text-on-background">
            Drop it here
          </Text>
          <Text className="text-on-surface-variant text-sm mb-8 text-center">
            Tap to browse files.{'\n'}Supports JPG, PNG, and SVG.
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleCameraPress}
              className="flex-row items-center gap-2 bg-surface-container-highest px-5 py-3 rounded-full border border-outline-variant/20 active:opacity-70"
            >
              <MaterialIcons name="photo_camera" size={20} color="#8ff5ff" />
              <Text className="text-xs font-bold font-label tracking-widest text-on-surface uppercase">
                Camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLibraryPress}
              className="flex-row items-center gap-2 bg-surface-container-highest px-5 py-3 rounded-full border border-outline-variant/20 active:opacity-70"
            >
              <MaterialIcons name="image" size={20} color="#8ff5ff" />
              <Text className="text-xs font-bold font-label tracking-widest text-on-surface uppercase">
                Library
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Style Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4 px-1">
            <Text className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">
              Active Style
            </Text>
            <TouchableOpacity>
              <Text className="text-xs font-bold text-primary">View All</Text>
            </TouchableOpacity>
          </View>

          {styles.map((style) => (
            <TouchableOpacity
              key={style.id}
              onPress={() => setSelectedStyle(style.id)}
              className={`p-4 rounded-2xl mb-3 flex-row items-start border ${
                selectedStyle === style.id
                  ? 'bg-surface-container-high border-primary/20'
                  : 'bg-surface-container-low border-outline-variant/10'
              }`}
            >
              <View className="flex-1">
                <MaterialIcons
                  name={style.icon as any}
                  size={24}
                  color={selectedStyle === style.id ? '#ac89ff' : '#ff59e3'}
                  style={{ marginBottom: 8 }}
                />
                <Text className="text-sm font-bold text-on-surface">{style.name}</Text>
                <Text className="text-xs text-on-surface-variant">{style.description}</Text>
              </View>
              {selectedStyle === style.id && (
                <MaterialIcons
                  name="check_circle"
                  size={20}
                  color="#8ff5ff"
                  style={{ position: 'absolute', top: 8, right: 8 }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          onPress={handleGeneratePress}
          className="bg-gradient-to-r from-primary to-primary-container rounded-full py-5 px-6 mb-8 flex-row items-center justify-center gap-2 shadow-lg active:opacity-80"
        >
          <MaterialIcons name="bolt" size={20} color="#003f43" />
          <Text className="font-headline font-bold text-lg text-on-primary-fixed uppercase">
            Generate Clipart
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
