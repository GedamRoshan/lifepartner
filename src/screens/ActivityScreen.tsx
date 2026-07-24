import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Check, X, Clock, Heart, MoreVertical, MapPin, Bell } from 'lucide-react-native';

const COLORS = {
  primary: '#FF2D55',
  accepted: '#22C55E',
  declined: '#FF2D55',
  pending: '#8B5CF6',
  surface: '#F7F2FF',
  white: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
};

type ActivityStatus = 'accepted' | 'declined' | 'pending';

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
    status: 'declined',
    timeAgo: '1 day ago',
  },
  {
    id: '4',
    name: 'Neha Singh',
    age: 25,
    profession: 'Marketing Manager',
    location: 'Bengaluru, Karnataka',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    isVerified: false,
    status: 'pending',
    timeAgo: '2 days ago',
  },
];

type TabKey = 'all' | 'accepted' | 'declined' | 'pending';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'declined', label: 'Declined' },
  { key: 'pending', label: 'Pending' },
];

const StatusBadge = ({ status }: { status: ActivityStatus }) => {
  const config = {
    accepted: { bg: '#F0FDF4', color: COLORS.accepted, label: 'Accepted', Icon: Check },
    declined: { bg: '#FEF2F2', color: COLORS.declined, label: 'Declined', Icon: X },
    pending: { bg: '#FAF5FF', color: COLORS.pending, label: 'Pending', Icon: Clock },
  }[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.bg }]}>
      <config.Icon size={12} color={config.color} strokeWidth={3} />
      <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

const ActivityCard = ({ item }: { item: ActivityItem }) => {
  const statusColor = COLORS[item.status];

  return (
    <View style={styles.cardWrapper}>
      {/* Colored Left Border Strip */}
      <View style={[styles.cardBorderLeft, { backgroundColor: statusColor }]} />
      
      <View style={styles.cardContent}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{item.name}</Text>
              {item.isVerified && (
                <View style={styles.verifiedDot}>
                  <Check size={10} color="#FFF" strokeWidth={4} />
                </View>
              )}
            </View>
            <StatusBadge status={item.status} />
          </View>
          
          <View style={styles.moreIconWrap}>
            <MoreVertical size={18} color={COLORS.textSecondary} />
          </View>

          <Text style={styles.subInfo}>
            {item.age} • {item.profession}
          </Text>
          
          <View style={styles.locationRow}>
            <MapPin size={12} color={COLORS.primary} strokeWidth={3} />
            <Text style={styles.location}>{item.location}</Text>
          </View>
          
          {item.message && (
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
          )}
          
          <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        </View>
      </View>
    </View>
  );
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedTab = ({ isActive, label, onPress }: { isActive: boolean; label: string; onPress: () => void }) => {
  const animation = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isActive ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isActive, animation]);

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.surface, COLORS.primary]
  });

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.8}
      style={[styles.tab, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
        {label}
      </Text>
    </AnimatedTouchableOpacity>
  );
};

export const ActivityScreen = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const filtered =
    activeTab === 'all'
      ? MOCK_ACTIVITIES
      : MOCK_ACTIVITIES.filter(a => a.status === activeTab);

  const acceptedCount = MOCK_ACTIVITIES.filter(a => a.status === 'accepted').length;
  const declinedCount = MOCK_ACTIVITIES.filter(a => a.status === 'declined').length;
  const pendingCount = MOCK_ACTIVITIES.filter(a => a.status === 'pending').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Activity</Text>
            <Text style={styles.headerSubtitle}>Track your connection requests</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn} activeOpacity={0.8}>
            <Bell size={24} color={COLORS.text} />
            <View style={styles.notificationDot}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {/* Accepted Card */}
          <View style={styles.statCardWrap}>
            <View style={[styles.statCardBorderTop, { backgroundColor: COLORS.accepted }]} />
            <View style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: '#F0FDF4' }]}>
                <Heart size={20} color={COLORS.accepted} />
              </View>
              <Text style={[styles.statNumber, { color: COLORS.accepted }]}>{acceptedCount}</Text>
              <Text style={styles.statLabel}>Accepted</Text>
            </View>
          </View>
          
          {/* Declined Card */}
          <View style={styles.statCardWrap}>
            <View style={[styles.statCardBorderTop, { backgroundColor: COLORS.declined }]} />
            <View style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: '#FEF2F2' }]}>
                <X size={20} color={COLORS.declined} strokeWidth={2.5} />
              </View>
              <Text style={[styles.statNumber, { color: COLORS.declined }]}>{declinedCount}</Text>
              <Text style={styles.statLabel}>Declined</Text>
            </View>
          </View>
          
          {/* Pending Card */}
          <View style={styles.statCardWrap}>
            <View style={[styles.statCardBorderTop, { backgroundColor: COLORS.pending }]} />
            <View style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: '#FAF5FF' }]}>
                <Clock size={20} color={COLORS.pending} />
              </View>
              <Text style={[styles.statNumber, { color: COLORS.pending }]}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <AnimatedTab
                key={tab.key}
                isActive={isActive}
                label={tab.label}
                onPress={() => setActiveTab(tab.key)}
              />
            );
          })}
        </View>

        {/* List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>No activity yet</Text>
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
    backgroundColor: '#FFFBFD', // very light pinkish white bg matching the design
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    backgroundColor: COLORS.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  notificationText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCardWrap: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statCardBorderTop: {
    height: 4,
    width: '100%',
  },
  statCard: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  cardWrapper: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardBorderLeft: {
    width: 6,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.border,
  },
  cardBody: {
    flex: 1,
    marginLeft: 16,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingRight: 24, // space for more icon
  },
  moreIconWrap: {
    position: 'absolute',
    right: 0,
    top: 20,
    padding: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  verifiedDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.pending, // Purple badge
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  subInfo: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  location: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  messageBox: {
    backgroundColor: COLORS.surface, // light purple
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    marginRight: 10,
  },
  messageText: {
    fontSize: 12,
    color: '#4B5563', // dark greyish
    fontStyle: 'italic',
  },
  timeAgo: {
    fontSize: 11,
    color: '#94A3B8',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
});
