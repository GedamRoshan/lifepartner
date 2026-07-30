import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Filter, Shield, ChevronUp, Sparkles } from 'lucide-react-native';
import { ProfileCard } from '../components/ProfileCard';
import { AiMatchModal } from '../components/AiMatchModal';
import { theme } from '../theme';
import { MOCK_PROFILES } from '../utils/mockData';
import { useAppDispatch } from '../store/hooks';
import { likeProfile, dislikeProfile } from '../store/slices/profileSlice';
import { useNavigation } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DiscoverScreen = () => {
  const flatListRef = useRef<FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles, setProfiles] = useState(MOCK_PROFILES);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasSwiped, setHasSwiped] = useState(false);
  const [isAiModalVisible, setIsAiModalVisible] = useState(false);
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  React.useEffect(() => {
    if (!hasSwiped) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [hasSwiped, bounceAnim]);

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const fetchMoreProfiles = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    
    // Simulate a network delay of 1.5 seconds
    setTimeout(() => {
      // Create new mock profiles with unique IDs
      const newProfiles = MOCK_PROFILES.map(p => ({
        ...p,
        id: `${p.id}-page${page}`,
      }));
      setProfiles(prev => [...prev, ...newProfiles]);
      setPage(prevPage => prevPage + 1);
      setIsLoadingMore(false);
    }, 1500);
  };

  const handleAction = (type: 'like' | 'dislike') => {
    const profile = profiles[currentIndex];
    if (profile) {
      if (type === 'like') dispatch(likeProfile(profile.id));
      if (type === 'dislike') dispatch(dislikeProfile(profile.id));
    }
    
    if (!hasSwiped) setHasSwiped(true);
    
    // Do NOT auto-scroll on 'like' (Interest Sent) so user can see Interest Sent state & toast.
    // User will manually scroll up to the next profile.
    if (type === 'dislike' && currentIndex < profiles.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const handleReset = () => {
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });
    setCurrentIndex(0);
    setProfiles(MOCK_PROFILES);
    setPage(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>
            Life<Text style={styles.logoTextHighlight}>Partner</Text>
          </Text>
          <Text style={styles.subGreeting}>Find meaningful connections 🌷</Text>
        </View>
        <View style={styles.headerRightRow}>
          <TouchableOpacity
            style={styles.aiMatchButton}
            activeOpacity={0.85}
            onPress={() => setIsAiModalVisible(true)}
          >
            <Sparkles size={16} color="#FFFFFF" />
            <Text style={styles.aiMatchButtonText}>AI Auto Match</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
            <Filter size={20} color="#FF2D55" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.badgesRow}>
        <View style={styles.verifiedProfilesBadge}>
          <Shield size={12} color="#FF2D55" fill="#FF2D55" />
          <Text style={styles.verifiedProfilesText}>Verified Profiles</Text>
        </View>
        <View style={styles.avatarsBadge}>
          <View style={styles.avatarsGroup}>
            <Image source={{uri: 'https://i.pravatar.cc/100?img=1'}} style={[styles.miniAvatar, { zIndex: 3 }]} />
            <Image source={{uri: 'https://i.pravatar.cc/100?img=2'}} style={[styles.miniAvatar, { left: -12, zIndex: 2 }]} />
            <Image source={{uri: 'https://i.pravatar.cc/100?img=3'}} style={[styles.miniAvatar, { left: -24, zIndex: 1 }]} />
          </View>
          <Text style={[styles.plus12Text, { marginLeft: -16 }]}>+12</Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          ref={flatListRef}
          data={profiles}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.cardWrapper}>
              <ProfileCard 
                profile={item} 
                onAction={handleAction} 
                onPressProfile={() => navigation.navigate('UserDetails', { profile: item })}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          snapToInterval={SCREEN_HEIGHT * 0.72 + 20} 
          decelerationRate="fast"
          onScrollBeginDrag={() => {
            if (!hasSwiped) setHasSwiped(true);
          }}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          contentContainerStyle={styles.flatListContent}
          onEndReached={fetchMoreProfiles}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => {
            if (!isLoadingMore) return null;
            return (
              <View style={{ padding: 20 }}>
                <ActivityIndicator size="large" color="#FF2D55" />
              </View>
            );
          }}
        />
      </View>

      {!hasSwiped && (
        <Animated.View style={[styles.swipeUpWrapper, { transform: [{ translateY: bounceAnim }] }]}>
          <ChevronUp size={24} color="#FF6B9D" strokeWidth={3} />
          <Text style={styles.swipeUpText}>Swipe up to view more profiles</Text>
        </Animated.View>
      )}

      <AiMatchModal
        visible={isAiModalVisible}
        onClose={() => setIsAiModalVisible(false)}
        onConnect={(profile) => {
          navigation.navigate('UserDetails', { profile });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  logoTextHighlight: {
    color: '#FF2D55',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiMatchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 6,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  aiMatchButtonText: {
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF2D55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FFE8F0',
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  verifiedProfilesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  verifiedProfilesText: {
    fontSize: 12,
    color: '#FF2D55',
    fontWeight: '600',
  },
  avatarsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE8F0',
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 12,
    borderRadius: 24,
  },
  avatarsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  plus12Text: {
    fontSize: 12,
    color: '#FF2D55',
    fontWeight: '700',
  },
  listContainer: {
    flex: 1,
    marginTop: -10, 
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 150, 
  },
  cardWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  swipeUpWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  swipeUpText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
    marginTop: 4,
  },
});
