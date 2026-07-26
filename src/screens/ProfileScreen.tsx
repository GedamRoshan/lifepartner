import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';
import {
  LogOut,
  User,
  Briefcase,
  BookOpen,
  Calendar,
  Edit3,
  Shield,
  Settings,
  ChevronRight,
  Crown,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { clearAuthUser } from '../utils/authStorage';

const MenuItem = ({
  icon: Icon,
  label,
  color = theme.colors.primary,
}: {
  icon: typeof User;
  label: string;
  color?: string;
}) => (
  <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
    <View style={[styles.menuIcon, { backgroundColor: color + '18' }]}>
      <Icon size={20} color={color} />
    </View>
    <Text style={styles.menuLabel}>{label}</Text>
    <ChevronRight size={18} color={theme.colors.textMuted} />
  </TouchableOpacity>
);

export const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const likedCount = useAppSelector(state => state.profiles.likedProfiles.length);
  const isPro = useAppSelector(state => state.subscription.isPro);

  const handleLogout = async () => {
    await clearAuthUser();
    dispatch(logout());
  };

  const completionRate = user?.profileCompletion != null ? user.profileCompletion : 85;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity 
            style={styles.editButton} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Edit3 size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              {user?.photos && user.photos.length > 0 ? (
                <Image source={{ uri: user.photos[0] }} style={styles.avatarImage} />
              ) : (
                <User size={44} color={theme.colors.primary} />
              )}
            </View>
          </View>
          <Text style={styles.name}>{user?.name || 'Your Profile'}</Text>
          <Text style={styles.profession}>{user?.profession || 'LifePartner Member'}</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{likedCount}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statDivider} />
            <TouchableOpacity 
              style={styles.stat}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.statValue}>{completionRate}%</Text>
              <Text style={styles.statLabel}>Complete</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <View style={styles.infoCard}>
            {user?.age && (
              <View style={styles.infoRow}>
                <Calendar size={18} color={theme.colors.primary} />
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{user.age} years</Text>
              </View>
            )}
            {user?.religion && (
              <View style={styles.infoRow}>
                <BookOpen size={18} color={theme.colors.primary} />
                <Text style={styles.infoLabel}>Religion</Text>
                <Text style={styles.infoValue}>{user.religion}</Text>
              </View>
            )}
            {user?.profession && (
              <View style={styles.infoRow}>
                <Briefcase size={18} color={theme.colors.primary} />
                <Text style={styles.infoLabel}>Profession</Text>
                <Text style={styles.infoValue}>{user.profession}</Text>
              </View>
            )}
            {user?.bio ? (
              <Text style={styles.bio}>{user.bio}</Text>
            ) : (
              <Text style={styles.bioPlaceholder}>Add a bio to tell others about yourself</Text>
            )}
          </View>
        </View>

        {/* Subscription Status Card */}
        <View style={styles.subCard}>
          <View style={[styles.subIconWrap, isPro ? styles.subIconPro : styles.subIconFree]}>
            <Crown size={22} color={isPro ? '#FFD700' : theme.colors.textMuted} fill={isPro ? '#FFD700' : 'none'} />
          </View>
          <View style={styles.subInfo}>
            <Text style={styles.subTitle}>
              {isPro ? 'LifePartner Pro Active' : 'Free Plan'}
            </Text>
            <Text style={styles.subDesc}>
              {isPro
                ? 'All features unlocked · ₹250/month'
                : 'Upgrade to Pro for ₹250/month'}
            </Text>
          </View>
          {!isPro && (
            <View style={styles.upgradeBadge}>
              <Text style={styles.upgradeBadgeText}>Upgrade</Text>
            </View>
          )}
        </View>

        <View style={styles.menuSection}>
          <MenuItem icon={Shield} label="Privacy & Safety" color={theme.colors.success} />
          <MenuItem icon={Settings} label="Settings" color={theme.colors.textSecondary} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
          <LogOut size={20} color={theme.colors.white} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSoft,
  },
  scroll: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: theme.fonts.extraBold,
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  editButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  profileCard: {
    marginHorizontal: 22,
    marginTop: 8,
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  avatarRing: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.colors.primaryMuted,
    marginBottom: 14,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  name: {
    fontFamily: theme.fonts.extraBold,
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
  },
  profession: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    width: '100%',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: theme.fonts.extraBold,
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  statLabel: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border,
  },
  infoSection: {
    marginTop: 24,
    paddingHorizontal: 22,
  },
  sectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 18,
    gap: 14,
    ...theme.shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
  },
  bio: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 21,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 4,
    paddingTop: 14,
  },
  bioPlaceholder: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    paddingTop: 4,
  },
  subCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 22,
    marginTop: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    padding: 14,
    gap: 12,
    ...theme.shadows.sm,
    borderWidth: 1.5,
    borderColor: 'rgba(255,215,0,0.25)',
  },
  subIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subIconPro: {
    backgroundColor: 'rgba(255,215,0,0.15)',
  },
  subIconFree: {
    backgroundColor: theme.colors.surface,
  },
  subInfo: {
    flex: 1,
  },
  subTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subDesc: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  upgradeBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  upgradeBadgeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    color: theme.colors.white,
    fontWeight: '700',
  },
  menuSection: {
    marginTop: 16,
    paddingHorizontal: 22,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 14,
    ...theme.shadows.sm,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: 15,
    color: theme.colors.text,
    flex: 1,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 22,
    marginTop: 28,
    height: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.error,
    gap: 10,
    ...theme.shadows.sm,
  },
  logoutText: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
});
