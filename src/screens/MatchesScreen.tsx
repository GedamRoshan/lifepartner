import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Heart, MessageCircle, BadgeCheck } from 'lucide-react-native';
import { theme } from '../theme';
import { MOCK_PROFILES } from '../utils/mockData';
import { useAppSelector } from '../store/hooks';

export const MatchesScreen = () => {
  const likedIds = useAppSelector(state => state.profiles.likedProfiles);
  const likedProfiles = MOCK_PROFILES.filter(p => likedIds.includes(p.id));

  const renderMatch = ({ item }: { item: typeof MOCK_PROFILES[0] }) => (
    <TouchableOpacity style={styles.matchCard} activeOpacity={0.85}>
      <Image source={{ uri: item.image }} style={styles.matchImage} />
      <View style={styles.matchGradient} />
      <View style={styles.matchInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.matchName}>{item.name}, {item.age}</Text>
          {item.isVerified && <BadgeCheck size={16} color={theme.colors.success} />}
        </View>
        <Text style={styles.matchProfession}>{item.profession}</Text>
      </View>
      <TouchableOpacity style={styles.chatButton}>
        <MessageCircle size={18} color={theme.colors.white} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Likes</Text>
        <Text style={styles.subtitle}>
          {likedProfiles.length > 0
            ? `${likedProfiles.length} profile${likedProfiles.length > 1 ? 's' : ''} you liked`
            : 'Profiles you like will appear here'}
        </Text>
      </View>

      {likedProfiles.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Heart size={40} color={theme.colors.secondary} />
          </View>
          <Text style={styles.emptyTitle}>No likes yet</Text>
          <Text style={styles.emptySubtitle}>
            Swipe right on profiles in Discover to save them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={likedProfiles}
          renderItem={renderMatch}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
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
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  matchCard: {
    flex: 1,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: theme.colors.white,
    ...theme.shadows.md,
  },
  matchImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  matchGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  matchInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  matchName: {
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.white,
  },
  matchProfession: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  chatButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.secondaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
  },
  emptySubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
  },
});
