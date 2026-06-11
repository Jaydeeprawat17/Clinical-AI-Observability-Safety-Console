import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import UploadScreen from '../screens/UploadScreen';
import GenerateScreen from '../screens/GenerateScreen';
import ResultsScreen from '../screens/ResultsScreen';
import { theme } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ screenName }: { screenName: string }) => {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>{screenName} (Coming Soon)</Text>
    </View>
  );
};

const StylesScreen = () => <PlaceholderScreen screenName="Styles" />;
const ProfileScreen = () => <PlaceholderScreen screenName="Profile" />;

const GalleryStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: theme.colors.background },
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
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#5c5a61',
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: styles.tabIcon,
      }}
    >
      <Tab.Screen
        name="Upload"
        component={UploadScreen}
        options={{
          tabBarLabel: 'Create',
          tabBarIcon: ({ color }) => <MaterialIcons name="add" size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="Gallery"
        component={GalleryStack}
        options={{
          tabBarLabel: 'Gallery',
          tabBarIcon: ({ color }) => <MaterialIcons name="apps" size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="Styles"
        component={StylesScreen}
        options={{
          tabBarLabel: 'Styles',
          tabBarIcon: ({ color }) => <MaterialIcons name="palette" size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.lg,
  },
  tabBar: {
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
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tabIcon: {
    marginBottom: 2,
  },
});
