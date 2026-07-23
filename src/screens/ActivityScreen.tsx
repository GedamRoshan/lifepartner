import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
  SafeAreaView,
} from 'react-native';
import { CheckCircle, XCircle, Clock, Heart, X } from 'lucide-react-native';
import { theme } from '../theme';

type ActivityStatus = 'accepted' | 'rejected' | 'pending';

interface ActivityItem {
  id: string;
  name: string;
  age: number;
  profession: string;
  location: string;
  image: string;
  isVerified: boolean;
  status: ActivityStatus;
  timeAgo: string;
  message?: string;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    name: 'Ananya Sharma',
    age: 26,
    profession: 'Software Engineer',
    location: 'Mumbai, Maharashtra',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    isVerified: true,
    status: 'accepted',
    timeAgo: '2 hrs ago',
    message: 'Would love to connect! Your profile is lovely 😊',
  },
  {
    id: '2',
    name: 'Priya Patel',
    age: 24,
    profession: 'Doctor',
    location: 'Ahmedabad, Gujarat',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    isVerified: true,
    status: 'accepted',
    timeAgo: '5 hrs ago',
    message: 'Hi! Looking forward to getting to know you.',
  },
  {
    id: '3',
    name: 'Rahul Verma',
    age: 28,
    profession: 'Architect',
    location: 'Delhi, India',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    isVerified: false,
    status: 'rejected',
    timeAgo: '1 day ago',
  },
  {
    id: '4',
    name: 'Zara Khan',
    age: 25,
    profession: 'Graphic Designer',
    location: 'Bangalore, Karnataka',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    isVerified: true,
    status: 'rejected',
    timeAgo: '2 days ago',
  },
  {
    id: '5',
    name: 'Arjun Mehta',
    age: 30,
    profession: 'Entrepreneur',
    location: 'Pune, Maharashtra',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    isVerified: true,
    status: 'pending',
    timeAgo: '3 hrs ago',
  },
  {
    id: '6',
    name: 'Kavya Nair',
    age: 23,
    profession: 'Teacher',
    location: 'Kochi, Kerala',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    isVerified: false,
    status: 'pending',
    timeAgo: '6 hrs ago',
  },
];

type TabKey = 'all' | 'accepted' | 'rejected' | 'pending';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Declined' },
  { key: 'pending', label: 'Pending' },
];

const StatusBadge = ({ status }: { status: ActivityStatus }) => {
  const config = {
    accepted: {
      bg: 'rgba(67, 160, 71, 0.12)',
      color: '#43A047',
      label: 'Accepted',
      Icon: CheckCircle,
    },
    rejected: {
      bg: 'rgba(229, 57, 53, 0.12)',
      color: '#E53935',
      label: 'Declined',
      Icon: XCircle,
    },
    pending: {
      bg: 'rgba(156, 39, 176, 0.12)',
      color: '#9C27B0',
      label: 'Pending',
      Icon: Clock,
    },
  }[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <config.Icon size={12} color={config.color} />
      <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

const ActivityCard = ({ item }: { item: ActivityItem }) => {
  const borderColor =
    item.status === 'accepted'
      ? '#43A047'
      : item.status === 'rejected'
      ? '#E53935'
      : '#9C27B0';

  return (
    <View style={[styles.card, { borderLeftColor: borderColor }]}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            {item.isVerified && (
              <View style={styles.verifiedDot}>
                <Text style={styles.verifiedTick}>✓</Text>
              </View>
            )}
          </View>
          <StatusBadge status={item.status} />
        </View>
        <Text style={styles.subInfo}>
          {item.age} • {item.profession}
        </Text>
        <Text style={styles.location}>📍 {item.location}</Text>
        {item.message ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        ) : null}
        <Text style={styles.timeAgo}>{item.timeAgo}</Text>
      </View>
    </View>
  );
};

export const ActivityScreen = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const filtered =
    activeTab === 'all'
      ? MOCK_ACTIVITIES
      : MOCK_ACTIVITIES.filter(a => a.status === activeTab);

  const acceptedCount = MOCK_ACTIVITIES.filter(a => a.status === 'accepted').length;
  const rejectedCount = MOCK_ACTIVITIES.filter(a => a.status === 'rejected').length;
  const pendingCount = MOCK_ACTIVITIES.filter(a => a.status === 'pending').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity</Text>
          <Text style={styles.headerSubtitle}>Track your connection requests</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderTopColor: '#43A047' }]}>
            <Heart size={18} color="#43A047" />
            <Text style={[styles.statNumber, { color: '#43A047' }]}>{acceptedCount}</Text>
            <Text style={styles.statLabel}>Accepted</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: '#E53935' }]}>
            <X size={18} color="#E53935" />
            <Text style={[styles.statNumber, { color: '#E53935' }]}>{rejectedCount}</Text>
            <Text style={styles.statLabel}>Declined</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: '#9C27B0' }]}>
            <Clock size={18} color="#9C27B0" />
            <Text style={[styles.statNumber, { color: '#9C27B0' }]}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.8}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>No activity yet</Text>
              <Text style={styles.emptyDesc}>
                Start sending connection requests to see activity here.
              </Text>
            </View>
          ) : (
            filtered.map(item => <ActivityCard key={item.id} item={item} />)
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSoft,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSoft,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 12,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 26,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    margin: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 3,
    ...theme.shadows.sm,
  },
  statNumber: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    marginTop: 4,
  },
  statLabel: {
    fontFamily: theme.fonts.regular,
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  tabsScroll: {
    maxHeight: 48,
    marginBottom: 4,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.white,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: 14,
    borderLeftWidth: 4,
    ...theme.shadows.sm,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: theme.colors.surface,
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 15,
    color: theme.colors.text,
  },
  verifiedDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedTick: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    fontFamily: theme.fonts.medium,
    fontSize: 11,
  },
  subInfo: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  location: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 6,
  },
  messageBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 6,
  },
  messageText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  timeAgo: {
    fontFamily: theme.fonts.regular,
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 6,
  },
  emptyDesc: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
