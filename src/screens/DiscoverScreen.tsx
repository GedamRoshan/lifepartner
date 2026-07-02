import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Heart, X, Filter, Star, RotateCcw } from 'lucide-react-native';
import { ProfileCard } from '../components/ProfileCard';
import { MOCK_PROFILES } from '../utils/mockData';
import { theme } from '../theme';
import { useAppDispatch } from '../store/hooks';
import { likeProfile, dislikeProfile } from '../store/slices/profileSlice';

export const DiscoverScreen = () => {
  const swiperRef = useRef<Swiper<any>>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [allSwiped, setAllSwiped] = useState(false);
  const dispatch = useAppDispatch();

  const remaining = MOCK_PROFILES.length - cardIndex;

  const handleOnSwipedRight = (index: number) => {
    const profile = MOCK_PROFILES[index];
    if (profile) {
      dispatch(likeProfile(profile.id));
    }
    setCardIndex(index + 1);
  };

  const handleOnSwipedLeft = (index: number) => {
    const profile = MOCK_PROFILES[index];
    if (profile) {
      dispatch(dislikeProfile(profile.id));
    }
    setCardIndex(index + 1);
  };

  const handleReset = () => {
    setCardIndex(0);
    setAllSwiped(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Discover</Text>
          <Text style={styles.subGreeting}>
            {allSwiped ? 'No more profiles' : `${remaining} profiles nearby`}
          </Text>
        </View>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
          <Filter size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.swiperContainer}>
        {allSwiped ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Star size={36} color={theme.colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>You're all caught up!</Text>
            <Text style={styles.emptySubtitle}>
              Check back later for new profiles in your area
            </Text>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <RotateCcw size={18} color={theme.colors.white} />
              <Text style={styles.resetText}>Start Over</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Swiper
            ref={swiperRef}
            cards={MOCK_PROFILES}
            renderCard={card => (card ? <ProfileCard profile={card} /> : null)}
            onSwipedRight={handleOnSwipedRight}
            onSwipedLeft={handleOnSwipedLeft}
            onSwipedAll={() => setAllSwiped(true)}
            cardIndex={cardIndex}
            backgroundColor="transparent"
            stackSize={3}
            stackSeparation={12}
            animateCardOpacity
            disableTopSwipe
            disableBottomSwipe
            overlayLabels={{
              left: {
                title: 'PASS',
                style: {
                  label: {
                    backgroundColor: theme.colors.error,
                    borderColor: theme.colors.error,
                    color: 'white',
                    borderWidth: 2,
                    fontSize: 18,
                    fontWeight: '800',
                    borderRadius: 8,
                    padding: 8,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 40,
                    marginLeft: -20,
                  },
                },
              },
              right: {
                title: 'LIKE',
                style: {
                  label: {
                    backgroundColor: theme.colors.success,
                    borderColor: theme.colors.success,
                    color: 'white',
                    borderWidth: 2,
                    fontSize: 18,
                    fontWeight: '800',
                    borderRadius: 8,
                    padding: 8,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 40,
                    marginLeft: 20,
                  },
                },
              },
            }}
          />
        )}
      </View>

      {!allSwiped && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.dislikeButton]}
            onPress={() => swiperRef.current?.swipeLeft()}
            activeOpacity={0.85}
          >
            <X size={30} color={theme.colors.error} strokeWidth={2.5} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.superLikeButton]}
            onPress={() => swiperRef.current?.swipeRight()}
            activeOpacity={0.85}
          >
            <Star size={26} color={theme.colors.accent} fill={theme.colors.accent} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={() => swiperRef.current?.swipeRight()}
            activeOpacity={0.85}
          >
            <Heart size={30} color={theme.colors.white} fill={theme.colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSoft,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  greeting: {
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  swiperContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
    gap: 20,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  dislikeButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.error + '25',
  },
  superLikeButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.accent + '40',
  },
  likeButton: {
    backgroundColor: theme.colors.secondary,
    width: 72,
    height: 72,
    borderRadius: 36,
    ...theme.shadows.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 24,
    gap: 8,
    ...theme.shadows.md,
  },
  resetText: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
