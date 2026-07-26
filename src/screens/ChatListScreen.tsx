import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Search, Bell, Heart, MessageCircle, Edit, User, Users, ChevronRight } from 'lucide-react-native';
import { theme } from '../theme';
import Reanimated, { FadeInDown } from 'react-native-reanimated';

const CHAT_DATA = [
  {
    id: '1',
    type: 'notification',
    icon: Users,
    iconBg: '#F3E8F7',
    iconColor: '#8B5CF6',
    title: 'New Connection Requests',
    badge: 3,
    subtitle: 'You have 3 new connection requests',
    time: '',
    unread: true,
  },
  {
    id: '2',
    type: 'notification',
    icon: Heart,
    iconBg: '#FDECF0',
    iconColor: '#E91E63',
    title: 'Liked You',
    badge: 2,
    subtitle: 'See people who liked your profile',
    time: '9:45 AM',
    unread: true,
  },
  {
    id: '3',
    type: 'notification',
    icon: MessageCircle,
    iconBg: '#F5F0F8',
    iconColor: theme.colors.primary,
    title: 'Messages',
    badge: 0,
    subtitle: 'Continue your conversations',
    time: '9:20 AM',
    unread: false,
  },
];

const RECENT_CHATS = [
  {
    id: '4',
    type: 'chat',
    name: 'Connection Request',
    subtitle: 'Hi! I liked your profile.',
    time: '11:20 AM',
    unread: 1,
    avatar: 'default', // Placeholder for now
  },
  {
    id: '5',
    type: 'chat',
    name: 'Someone Special',
    subtitle: 'How are you today?',
    time: 'Yesterday',
    unread: 2,
    avatar: 'default',
  },
  {
    id: '6',
    type: 'chat',
    name: 'New Match',
    subtitle: 'That sounds great!',
    time: '31 May',
    unread: 0,
    avatar: 'default',
  },
  {
    id: '7',
    type: 'chat',
    name: 'Profile Visitor',
    subtitle: 'Nice to meet you.',
    time: '30 May',
    unread: 0,
    avatar: 'default',
  },
];

export const ChatListScreen = ({ navigation }: any) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const renderFilter = (filter: string) => (
    <TouchableOpacity
      style={[
        styles.filterPill,
        activeFilter === filter && styles.filterPillActive,
      ]}
      onPress={() => setActiveFilter(filter)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterText,
          activeFilter === filter && styles.filterTextActive,
        ]}
      >
        {filter}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }: any) => {
    if (item.type === 'notification') {
      const Icon = item.icon;
      return (
        <Reanimated.View entering={FadeInDown.delay(index * 80).springify().damping(16).mass(0.8).stiffness(150)}>
          <TouchableOpacity
            style={styles.chatRow}
            onPress={() => {
              // For now, any click just opens the conversation view
              navigation.navigate('ChatConversation', { chatName: item.title });
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
              <Icon size={24} color={item.iconColor} strokeWidth={1.5} />
            </View>
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <View style={styles.titleRow}>
                  <Text style={styles.chatTitle}>{item.title}</Text>
                </View>
                {item.time ? <Text style={styles.chatTime}>{item.time}</Text> : null}
              </View>
              <View style={styles.subtitleRow}>
                <Text style={styles.chatSubtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
                {item.badge > 0 && (
                  <View style={[styles.badge, { backgroundColor: '#8B5CF6', flexDirection: 'row', gap: 2, alignItems: 'center' }]}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                    <ChevronRight size={12} color="#FFF" />
                  </View>
                )}
                {item.unread && !item.badge && <View style={styles.unreadDot} />}
              </View>
            </View>
          </TouchableOpacity>
        </Reanimated.View>
      );
    }

    return (
      <Reanimated.View entering={FadeInDown.delay(index * 80).springify().damping(16).mass(0.8).stiffness(150)}>
        <TouchableOpacity
          style={styles.chatRow}
          onPress={() => {
            navigation.navigate('ChatConversation', { chatName: item.name });
          }}
          activeOpacity={0.7}
        >
          <View style={styles.avatarContainer}>
            <Image source={{uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'}} style={styles.avatarImage} />
          </View>
          <View style={styles.chatContent}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>{item.name}</Text>
              <Text style={styles.chatTime}>{item.time}</Text>
            </View>
            <View style={styles.subtitleRow}>
              <Text style={styles.chatSubtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{item.unread}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

  // local User component removed

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Chat</Text>
          <Text style={styles.headerSubtitle}>Start meaningful conversations</Text>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Edit size={20} color={theme.colors.secondary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={theme.colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats"
          placeholderTextColor={theme.colors.textMuted}
        />
      </View>

      <View style={styles.filtersContainer}>
        {renderFilter('All')}
        {renderFilter('Unread')}
        {renderFilter('Requests')}
        {renderFilter('Archived')}
      </View>

      <FlatList
        data={[...CHAT_DATA, { id: 'header_recent' }, ...RECENT_CHATS]}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }: any) => {
          if (item.id === 'header_recent') {
            return null; // The mockup just lists people below the notifications directly
          }
          return renderItem({ item, index });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: -2,
  },
  editBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.secondaryMuted,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.text,
    height: '100%',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
  },
  filterPillActive: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: theme.colors.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    shadowColor: '#1A0010',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#F3E8F7',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  defaultUserIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultUserIconText: {
    fontSize: 28,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatTitle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
  },
  badgeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: theme.colors.white,
  },
  chatTime: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  subtitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
    paddingRight: 16,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
  },
  unreadBadgeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: theme.colors.white,
  },
  sectionHeader: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 10,
    marginBottom: 10,
  },
});
