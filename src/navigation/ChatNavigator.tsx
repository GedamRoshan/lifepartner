import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatListScreen } from '../screens/ChatListScreen';
import { ChatConversationScreen } from '../screens/ChatConversationScreen';

const Stack = createStackNavigator();

export const ChatNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
    </Stack.Navigator>
  );
};
