import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Heart,
  MessageCircle,
  User,
  Compass,
  Map as MapIcon,
} from 'lucide-react-native';

import { DiscoverScreen } from '../screens/DiscoverScreen';
import { MapScreen } from '../screens/MapScreen';
import { MatchesScreen } from '../screens/MatchesScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({
  Icon,
  color,
  size,
  focused,
}: {
  Icon: typeof Compass;
  color: string;
  size: number;
  focused: boolean;
}) => (
  <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
    <Icon size={size - 2} color={color} strokeWidth={focused ? 2.5 : 2} />
  </View>
);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={Compass} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={MapIcon} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Likes"
        component={MatchesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={Heart} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={MessageCircle} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={User} color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 8,
    backgroundColor: theme.colors.white,
    ...theme.shadows.md,
  },
  tabLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  iconWrap: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  iconWrapActive: {
    backgroundColor: theme.colors.primaryMuted,
  },
});
