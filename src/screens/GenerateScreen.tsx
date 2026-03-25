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

interface Asset {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  status: 'done' | 'processing';
  style?: string;
  quality?: string;
}

export const GenerateScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(false);

  const assets: Asset[] = [
    {
      id: '1',
      title: 'Prism Bloom',
      subtitle: '4K • High Fidelity',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYGWrSVTwP3J8yqDKya-UkTf-PBv0Tx2zfW45PJZ1AZESGpWqnqHrh_BXYiMy2_vKtdtYoPtwpEp3NQX-92fJmwAXenL6vtEWYlgGwJSDFtzG1RfHX6g0JSvsd7nNoTDwsNQhy_Zse1pp9uzZnJFuP6z8QuXlzMAQVBeUi5sAppONzd-yr81IkAaVbhWwABaCeND9O8u1PVsDS9i19wOfEF6h7ZnKcPiIriV1igtvtzZBpm3T2Po-_P7FWtFGrgvSRiL5xjJ-BQq4',
      status: 'done',
    },
    {
      id: '2',
      title: 'Processing...',
      subtitle: 'Refining...',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBHBGpCro7ubtdkToOfkCl5ZBVNWQnVjWBRvMz5DmLb9uReCPfZdm-rC-fluZqj0PeCaQaHNkExXnGm92BDM2fk3fv57UrEgdT5hYpYmETCs3c9GngDy6rlrChfCdiEgSjpaHsgv8F3aZ7Lwvqq-tHyfystgrhftipmCryDz6Dydq3kX_Y6Jjs-1rMfXCaCAmClzqojgBhDSVqYrkvgXRfwlvD15tUbVC2Xr3P0Qs5T009LMFkrpATT6vC3AHMXoeZwI9Q6istlYfk',
      status: 'processing',
    },
    {
      id: '3',
      title: 'Neon Ronin',
      subtitle: '3200 x 3200 • PNG Transparent',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBHBGpCro7ubtdkToOfkCl5ZBVNWQnVjWBRvMz5DmLb9uReCPfZdm-rC-fluZqj0PeCaQaHNkExXnGm92BDM2fk3fv57UrEgdT5hYpYmETCs3c9GngDy6rlrChfCdiEgSjpaHsgv8F3aZ7Lwvqq-tHyfystgrhftipmCryDz6Dydq3kX_Y6Jjs-1rMfXCaCAmClzqojgBhDSVqYrkvgXRfwlvD15tUbVC2Xr3P0Qs5T009LMFkrpATT6vC3AHMXoeZwI9Q6istlYfk',
      status: 'done',
      style: 'Cyberpunk',
      quality: 'Maximum',
    },
    {
      id: '4',
      title: 'Neural Flow',
      subtitle: '4K • Abstract 3D',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAgxYsbqe63yFLnQk7mi6M2I6pOKhYTZ9pyEeFn_zJfqkH7str1K3TFINNr-FqTcuMqZmlZcBrvMESXCEicqohQuMOMef-aS8OIQ05wyERxvfa2oDbP-upiftlAEuGCNSJydy0fBx1X6gzjFtkw2vi_AyMWvz6C7c5fwll2q6IkRDCUuJ1traSovHZqG5dzE8jmhJVLYNn9XQvBQ8YJNdGIQYYqEKdXu5fAUK7Zw9JVsKrMeMMHreAoIS2pKMW9kCCbPcRx96QFYbA',
      status: 'done',
    },
  ];

  const handleEdit = (assetId: string) => {
    console.log('Edit asset:', assetId);
  };

  const handleShare = (assetId: string) => {
    console.log('Share asset:', assetId);
  };

  const handleDownload = (assetId: string) => {
    console.log('Download asset:', assetId);
  };

  const handleNewGeneration = () => {
    console.log('New Generation button pressed');
    navigation?.navigate('Upload');
  };

  const renderAsset = ({ item }: { item: Asset }) => {
    if (item.status === 'processing') {
      return <SkeletonAssetCard />;
    }

    return (
      <View className="mb-8">
        <View className="rounded-3xl overflow-hidden bg-surface-container-low mb-4 relative">
          <Image
            source={{ uri: item.image }}
            style={{ width: '100%', height: 320 }}
            className="rounded-3xl"
          />

          {/* Status Badge */}
          <View className="absolute top-4 left-4 flex-row items-center gap-2 bg-black/40 px-3 py-1 rounded-full">
            <View className="w-1.5 h-1.5 rounded-full bg-primary" />
            <Text className="font-label text-xs font-bold uppercase tracking-wider text-on-surface">
              {item.status === 'done' ? 'Done' : 'Processing'}
            </Text>
          </View>

          {/* Stats Overlay (if available) */}
          {item.style && item.quality && (
            <View className="absolute bottom-4 left-4 right-4 bg-black/40 rounded-2xl p-3 flex-row justify-around">
              <View className="flex-1 justify-center items-center">
                <Text className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">
                  Style
                </Text>
                <Text className="font-headline text-sm font-bold text-primary">{item.style}</Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#ffffff20' }} />
              <View className="flex-1 justify-center items-center">
                <Text className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">
                  Quality
                </Text>
                <Text className="font-headline text-sm font-bold text-primary">{item.quality}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Asset Info and Buttons */}
        <View className="flex-row justify-between items-center px-2">
          <View className="flex-1">
            <Text className="font-headline font-semibold text-lg text-on-background">
              {item.title}
            </Text>
            <Text className="font-body text-xs text-on-surface-variant">{item.subtitle}</Text>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => handleEdit(item.id)}
              className="w-10 h-10 rounded-full bg-surface-container-high justify-center items-center active:opacity-70"
            >
              <MaterialIcons name="edit" size={20} color="#f8f5fd" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleShare(item.id)}
              className="w-10 h-10 rounded-full bg-surface-container-high justify-center items-center active:opacity-70"
            >
              <MaterialIcons name="share" size={20} color="#f8f5fd" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDownload(item.id)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container justify-center items-center active:opacity-70"
            >
              <MaterialIcons name="download" size={20} color="#003f43" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 border-b border-outline-variant/10 flex-row justify-between items-center">
        <View className="flex-row items-center gap-3">
          <MaterialIcons name="auto_awesome" size={24} color="#06b6d4" />
          <Text className="font-headline font-bold text-xl tracking-tight text-cyan-400">
            Digital Curator
          </Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-surface-container-high justify-center items-center">
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX_qoFwewhalJUf-6cvX5yywn-W0dWMnpCq4lcagM2OEa_sCPN5KaLuCapi5kKtP0gCRAps4vSdPcp4lT2JpZDbNoG9WBT6HmsyPGrug5KSFkt0tvV13HZ60zVZ7zgVLzH-pYyNT8hpTKHSoHBYqc6srDzXWqDCjVNBJKK3Mj3cj8EPnjbMWHxOgWRYHEQ15NyOR13fMXSlLGYRE6qu8xvPNadtm-N709sPLEp0v4UEK7XsFphskFxnkovx6ogZFQ48ZWyWlQoGHg',
            }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={assets}
        renderItem={renderAsset}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="px-6 py-8">
            <Text className="font-headline text-4xl font-bold tracking-tighter mb-2 text-on-background leading-none">
              Generated Visions
            </Text>
            <Text className="text-on-surface-variant font-body text-sm leading-relaxed max-w-xs">
              Neural refinement in progress. Your latest high-fidelity assets.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB - New Generation */}
      <TouchableOpacity
        onPress={handleNewGeneration}
        className="absolute bottom-32 right-6 bg-gradient-to-br from-primary to-primary-container rounded-full px-6 py-4 flex-row items-center gap-3 shadow-lg active:opacity-80"
      >
        <MaterialIcons name="add" size={24} color="#003f43" />
        <Text className="font-headline font-bold text-on-primary-fixed">New Generation</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
