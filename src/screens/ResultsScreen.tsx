import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SkeletonAssetCard } from '../components/SkeletonAssetCard';
import { SkeletonStyleCard } from '../components/SkeletonStyleCard';

interface FilterChip {
  id: string;
  label: string;
  active?: boolean;
}

interface Asset {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  size: string;
}

export const ResultsScreen = ({ navigation }: any) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const filters: FilterChip[] = [
    { id: 'all', label: 'All Assets', active: true },
    { id: 'vector', label: 'Vector Art' },
    { id: '3d', label: '3D Renders' },
    { id: 'cyberpunk', label: 'Cyberpunk' },
  ];

  const assets: Asset[] = [
    {
      id: '1',
      title: 'Liquid Obsidian Sphere',
      subtitle: 'High-fidelity 3D asset',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuArKSCmkGF_DvhAWhiNE-B2wHZatbEIiOVin4kJSVgqDFUfdk8P5bdqfd0buhjSLroMAjQ2VmRYouaebSbrxfitKcDBpzUfC6ucbFrJQlfXQmNsFz-90pGl2JnlT0EZbWN7A74tootzRgL8MOchDgK-JmcWzXej9LOm3bItwS-oKqm539qgUdmk2I-_BRs1vxsqkM_NIspjZPoT76pFuP5rMJu_AuS7f2AJoRTi-mqjG4CMbg0IIFpAAsHf7VRctK7HqlePocMmgsw',
      category: '3D Asset',
      size: '4.2MB',
    },
    {
      id: '2',
      title: 'Cyber City Vector',
      subtitle: 'Detailed illustration',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCKDNKa1iJO3qCarV6xhZzexJONTYpFxWCNBA6TPWLQPClzCCkFhbM7MZ4IGrUWylUlOY81pAOMrccnkhEwF3cQsl4rt6TFIw29BIcMH40h1OG360VePpn2JQ0X15tYtYOeDFwBR0_qszDIy_XqyTI0VJO7whvoVfxQcJXE5jmXkb-Eo5pFQIPS0okKMnPSnQREFffL67gmx41oruaS1DbXYOJ9MFaN_STz-Bn0Q_T4DOahJAz3vMV13efxUMpGdmCt2FsuroKfrow',
      category: 'Vector',
      size: '2.1MB',
    },
  ];

  const handleDownload = (assetId: string) => {
    console.log('Download asset:', assetId);
  };

  const handleCopyPrompt = () => {
    console.log('Copy prompt');
  };

  const renderFilterChip = (filter: FilterChip) => (
    <TouchableOpacity
      key={filter.id}
      onPress={() => setActiveFilter(filter.id)}
      className={`px-6 py-2 rounded-full ${
        activeFilter === filter.id
          ? 'bg-surface-container-high border border-secondary'
          : 'bg-surface-container-low border border-outline-variant/10'
      }`}
    >
      <Text
        className={`font-label text-xs font-bold uppercase tracking-widest ${
          activeFilter === filter.id ? 'text-on-background' : 'text-on-surface-variant'
        }`}
      >
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  const renderAsset = ({ item }: { item: Asset }) => (
    <View className="mb-6 rounded-2xl overflow-hidden bg-surface-container-low">
      <View className="relative h-64 overflow-hidden">
        <Image
          source={{ uri: item.image }}
          style={{ width: '100%', height: 256 }}
        />
        <View className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent opacity-0 group-hover:opacity-100 justify-end p-4">
          <TouchableOpacity
            onPress={() => handleDownload(item.id)}
            className="bg-primary rounded-full py-3 px-4 justify-center items-center"
          >
            <Text className="text-on-primary-fixed font-bold text-sm">Download Asset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs font-bold text-secondary uppercase tracking-widest">
            {item.category}
          </Text>
          <Text className="text-xs text-on-surface-variant">{item.size}</Text>
        </View>
        <Text className="font-headline text-lg font-semibold text-on-background">
          {item.title}
        </Text>
        <Text className="text-xs text-on-surface-variant">{item.subtitle}</Text>
      </View>
    </View>
  );

  const renderComparison = () => (
    <View className="mb-8 rounded-2xl overflow-hidden bg-surface-container-low h-80 relative">
      <Image
        source={{
          uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYqPqgv-5Y3U87JdP7etRBgHzN384i6jMLTmm4ybCTWyxrrfxaI5N_iuIsVgg0GufXOql9uQ7Vzts4piRgPUQzWlf2SOMY9Q-Bh4uKnl7BbTwU2C0u3wszF4WEyYU1i9GzWmy3WlY2MpoRSILC0O00PMZSZ9OLTZJb5YvDrWdeXW6tS2yPOYqZDh_akt25iLtrP7JCcfykfw9SkxVZIng2PmV_4Eo87T0ynwVqe0d81BsxuzdiWOIwT7OqulRB9A1-A1NUjvEH86I',
        }}
        style={{ width: '100%', height: '100%' }}
      />
      <View className="absolute bottom-6 left-6 bg-zinc-950/80 backdrop-opacity-90 px-3 py-1 rounded-full">
        <Text className="text-xs font-bold text-primary uppercase tracking-widest">
          Enhancement View
        </Text>
      </View>
    </View>
  );

  const renderStyleCard = () => (
    <View className="mb-8 bg-surface-container-high rounded-2xl p-6">
      <View className="flex-row justify-between items-start mb-4">
        <View className="w-12 h-12 rounded-lg bg-primary-container/10 justify-center items-center">
          <MaterialIcons name="palette" size={28} color="#8ff5ff" />
        </View>
        <MaterialIcons name="open_in_full" size={20} color="#4b5563" />
      </View>
      <Text className="font-headline text-2xl font-bold mb-3 text-on-background">
        Style Alchemy
      </Text>
      <Text className="text-on-surface-variant font-body text-sm leading-relaxed">
        Neural blending active. Mixing 'Cyber-Noir' with 'Organic Glass' for a unique aesthetic
        footprint.
      </Text>
      <View className="mt-4 pt-4 border-t border-outline-variant/20 flex-row gap-2">
        <View className="h-8 w-8 rounded bg-primary/30" />
        <View className="h-8 w-8 rounded bg-secondary/30" />
        <View className="h-8 w-8 rounded bg-tertiary/30" />
      </View>
    </View>
  );

  const renderMetadataCard = () => (
    <View className="mb-8 bg-surface-container-low rounded-2xl p-6">
      <View className="h-48 bg-surface-container-highest rounded-lg mb-4" />
      <View className="space-y-2 mb-4">
        <View className="h-6 bg-surface-container-highest rounded w-3/4" />
        <View className="h-4 bg-surface-container-highest rounded w-1/2" />
      </View>
      <TouchableOpacity className="flex-row items-center gap-2 mt-4">
        <MaterialIcons name="copy_all" size={18} color="#8ff5ff" />
        <Text className="text-xs font-bold text-primary uppercase tracking-widest">
          Copy Prompt
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 border-b border-outline-variant/10 flex-row justify-between items-center">
        <View className="flex-1">
          <View className="flex-row items-center gap-3 mb-2">
            <MaterialIcons name="auto_awesome" size={24} color="#06b6d4" />
            <Text className="font-headline font-bold text-lg tracking-tight text-cyan-400">
              Digital Curator
            </Text>
          </View>
        </View>
        <View className="w-10 h-10 rounded-full bg-surface-container-high justify-center items-center">
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3vSI9jAEj4HIzS27M3JJtjiz7bTgnUPcITYX7Wz6N09IV7AWV_c0duZZwv7O5nt4NkDVGYnz5LceAmnnobrah_RzetWe-5EfJt82QvJVSND_HwEbJgu4NbneW8ud1EHxOSm7JfhockYinUN610MZvIjHUlE1GJsGkxahw7jaT0W9T7yen7De_qAG2_-qlXuNDPJeGYC68P_dIrI_MUhUBmksrAC6Q6anCIo7uOwC2Wv9wqvJfSrWY0BXyP8Bn4lbkUj5MhfQW_eg',
            }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View className="px-6 py-6">
          <Text className="font-headline text-5xl font-bold tracking-tighter mb-3 text-on-background">
            Generated <Text className="text-primary italic">Visions</Text>
          </Text>
          <Text className="text-on-surface-variant max-w-xs font-body text-base leading-relaxed">
            Refining the digital essence. Explore your latest high-fidelity assets curated by
            neural networks.
          </Text>
        </View>

        {/* Filters */}
        <View className="px-6 mb-8">
          <FlatList
            data={filters}
            renderItem={({ item }) => renderFilterChip(item)}
            keyExtractor={(item) => item.id}
            horizontal
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-2" />}
          />
        </View>

        {/* Main Content */}
        <View className="px-6">
          {/* Comparison Card */}
          {renderComparison()}

          {/* Style Card */}
          {renderStyleCard()}

          {/* Skeleton/Loading Card */}
          {renderMetadataCard()}

          {/* Assets Grid */}
          <FlatList
            data={assets}
            renderItem={renderAsset}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => renderAsset({ item })}
          />
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity className="absolute bottom-32 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-500 justify-center items-center shadow-lg active:opacity-80">
        <MaterialIcons name="add" size={28} color="#003f43" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
