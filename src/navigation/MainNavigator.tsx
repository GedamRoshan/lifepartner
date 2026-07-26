import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Bell,
  MessageCircle,
  User,
  Compass,
  Crown,
} from 'lucide-react-native';

import { DiscoverScreen } from '../screens/DiscoverScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { SubscriptionScreen } from '../screens/SubscriptionScreen';
import { ChatNavigator } from './ChatNavigator';
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
  <View style={styles.iconWrap}>
    <Icon size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
  </View>
);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF2D55',
        tabBarInactiveTintColor: '#666666',
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
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={Bell} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Premium"
        component={SubscriptionScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={Crown} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatNavigator}
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
    borderTopWidth: 1,
    borderTopColor: '#FFE8F0',
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
