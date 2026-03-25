import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { UploadScreen } from '../screens/UploadScreen';
import { GenerateScreen } from '../screens/GenerateScreen';
import { ResultsScreen } from '../screens/ResultsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ screenName }: { screenName: string }) => {
  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Text className="text-on-surface text-lg">{screenName} (Coming Soon)</Text>
    </View>
  );
};

const GalleryStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#0e0e13' },
    }}
  >
    <Stack.Screen name="GenerateMain" component={GenerateScreen} />
    <Stack.Screen name="ResultsMain" component={ResultsScreen} />
  </Stack.Navigator>
);

export const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(9, 9, 15, 0.8)',
          borderTopColor: 'rgba(76, 74, 77, 0.2)',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: '#8ff5ff',
        tabBarInactiveTintColor: '#5c5a61',
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: 4,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tab.Screen
        name="Upload"
        component={UploadScreen}
        options={{
          tabBarLabel: 'Create',
          tabBarIcon: ({ color }) => <MaterialIcons name="cloud_upload" size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="Gallery"
        component={GalleryStack}
        options={{
          tabBarLabel: 'Gallery',
          tabBarIcon: ({ color }) => <MaterialIcons name="grid_view" size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="Styles"
        component={() => <PlaceholderScreen screenName="Styles" />}
        options={{
          tabBarLabel: 'Styles',
          tabBarIcon: ({ color }) => <MaterialIcons name="palette" size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={() => <PlaceholderScreen screenName="Profile" />}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
