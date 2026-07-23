import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import {
  Crown,
  Check,
  Image as ImageIcon,
  Phone,
  MessageCircle,
  Star,
  Zap,
  Shield,
  Heart,
  Sparkles,
} from 'lucide-react-native';
import { theme } from '../theme';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { activatePro } from '../store/slices/subscriptionSlice';

const FEATURES_PRO = [
  {
    icon: ImageIcon,
    title: 'View All Photos',
    description: 'See every photo in another user\'s gallery without any blur',
    color: '#9C27B0',
  },
  {
    icon: Phone,
    title: 'Share Phone Number in Chat',
    description: 'Send your number directly through chat to connect personally',
    color: '#E91E63',
  },
  {
    icon: Heart,
    title: 'Unlimited Likes',
    description: 'Like as many profiles as you want without daily limits',
    color: '#F44336',
  },
  {
    icon: Star,
    title: 'Priority Discovery',
    description: 'Your profile appears first in others\' Discover feed',
    color: '#FF9800',
  },
  {
    icon: Shield,
    title: 'Verified Badge',
    description: 'Stand out with a blue Pro verification badge on your profile',
    color: '#2196F3',
  },
  {
    icon: Zap,
    title: 'Instant Match Alerts',
    description: 'Get real-time notifications when someone matches with you',
    color: '#4CAF50',
  },
];

const FEATURES_FREE = [
  { label: 'View profile & details of other users', included: true },
  { label: 'Free chat once you have a mutual match', included: true },
  { label: 'Basic swipe & discover', included: true },
  { label: 'View all photos of a user', included: false },
  { label: 'Share phone number in chat', included: false },
  { label: 'Unlimited likes per day', included: false },
  { label: 'Priority in discovery feed', included: false },
];

export const SubscriptionScreen = () => {
  const dispatch = useAppDispatch();
  const isPro = useAppSelector(state => state.subscription.isPro);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = () => {
    Alert.alert(
      'Confirm Subscription',
      'Subscribe to LifePartner Pro for ₹250/month?\n\nYou will get unlimited access to all premium features.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe ₹250',
          style: 'default',
          onPress: () => {
            setLoading(true);
            // Simulate payment processing
            setTimeout(() => {
              setLoading(false);
              dispatch(activatePro());
              Alert.alert(
                '🎉 Welcome to Pro!',
                'Your subscription is now active. Enjoy all premium features!',
                [{ text: 'Let\'s Go!' }],
              );
            }, 1500);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.crownCircle}>
            <Crown size={40} color="#FFD700" fill="#FFD700" />
          </View>
          <Text style={styles.heroTitle}>LifePartner Pro</Text>
          <Text style={styles.heroSubtitle}>
            Unlock everything. Find your perfect match faster.
          </Text>

          {isPro && (
            <View style={styles.activeProBadge}>
              <Sparkles size={14} color="#FFD700" />
              <Text style={styles.activeProText}>You're a Pro Member 🎉</Text>
            </View>
          )}
        </View>

        {/* Price Card */}
        <View style={styles.priceCard}>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>MOST POPULAR</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.currency}>₹</Text>
            <Text style={styles.price}>250</Text>
            <Text style={styles.pricePeriod}>/month</Text>
          </View>
          <Text style={styles.priceDescription}>
            Cancel anytime · No hidden charges
          </Text>

          <TouchableOpacity
            style={[styles.subscribeBtn, isPro && styles.subscribeBtnActive, loading && styles.subscribeBtnLoading]}
            onPress={isPro ? undefined : handleSubscribe}
            activeOpacity={isPro ? 1 : 0.85}
            disabled={loading}>
            <Crown size={18} color={isPro ? '#FFD700' : theme.colors.white} />
            <Text style={[styles.subscribeBtnText, isPro && styles.subscribeBtnTextActive]}>
              {loading ? 'Processing...' : isPro ? 'Active Subscription ✓' : 'Subscribe Now — ₹250'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pro Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you get with Pro</Text>
          <View style={styles.featuresGrid}>
            {FEATURES_PRO.map((feature, idx) => (
              <View key={idx} style={styles.featureCard}>
                <View style={[styles.featureIconWrap, { backgroundColor: feature.color + '18' }]}>
                  <feature.icon size={22} color={feature.color} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Free vs Pro Comparison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Free vs Pro</Text>
          <View style={styles.comparisonCard}>
            {FEATURES_FREE.map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.comparisonRow,
                  idx < FEATURES_FREE.length - 1 && styles.comparisonRowBorder,
                ]}>
                <View style={[styles.checkCircle, item.included ? styles.checkIncluded : styles.checkExcluded]}>
                  {item.included ? (
                    <Check size={13} color="#43A047" strokeWidth={3} />
                  ) : (
                    <Text style={styles.crossText}>✕</Text>
                  )}
                </View>
                <Text style={[styles.comparisonLabel, !item.included && styles.comparisonLabelMuted]}>
                  {item.label}
                </Text>
                {!item.included && (
                  <View style={styles.proBadgeSmall}>
                    <Crown size={9} color="#FFD700" />
                    <Text style={styles.proBadgeSmallText}>PRO</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Security note */}
        <View style={styles.securityNote}>
          <Shield size={14} color={theme.colors.textMuted} />
          <Text style={styles.securityText}>
            Secure payment · Auto-renews monthly · Cancel anytime from settings
          </Text>
        </View>

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
    paddingBottom: 48,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  crownCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,215,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  heroTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 30,
    fontWeight: '900',
    color: theme.colors.text,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  activeProBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.4)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 14,
  },
  activeProText: {
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    color: '#B8860B',
    fontWeight: '700',
  },

  // Price Card
  priceCard: {
    marginHorizontal: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary + '30',
    ...theme.shadows.md,
  },
  priceBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
  },
  priceBadgeText: {
    fontFamily: theme.fonts.extraBold,
    fontSize: 11,
    color: theme.colors.white,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginBottom: 6,
  },
  currency: {
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 6,
  },
  price: {
    fontFamily: theme.fonts.bold,
    fontSize: 64,
    fontWeight: '900',
    color: theme.colors.primary,
    lineHeight: 70,
    letterSpacing: -2,
  },
  pricePeriod: {
    fontFamily: theme.fonts.regular,
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginBottom: 10,
  },
  priceDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 22,
  },
  subscribeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    gap: 10,
    ...theme.shadows.md,
  },
  subscribeBtnActive: {
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  subscribeBtnLoading: {
    opacity: 0.65,
  },
  subscribeBtnText: {
    fontFamily: theme.fonts.bold,
    fontSize: 17,
    color: theme.colors.white,
    fontWeight: '700',
  },
  subscribeBtnTextActive: {
    color: '#B8860B',
  },

  // Section
  section: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: theme.fonts.extraBold,
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },

  // Features grid
  featuresGrid: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 18,
    ...theme.shadows.sm,
  },
  featureIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 5,
  },
  featureDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
  },

  // Comparison
  comparisonCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  comparisonRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkIncluded: {
    backgroundColor: 'rgba(67,160,71,0.12)',
  },
  checkExcluded: {
    backgroundColor: 'rgba(229,57,53,0.10)',
  },
  crossText: {
    fontSize: 11,
    color: theme.colors.error,
    fontWeight: '700',
  },
  comparisonLabel: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 20,
  },
  comparisonLabelMuted: {
    color: theme.colors.textSecondary,
  },
  proBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.35)',
  },
  proBadgeSmallText: {
    fontFamily: theme.fonts.extraBold,
    fontSize: 9,
    color: '#B8860B',
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Security
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 28,
    marginHorizontal: 24,
  },
  securityText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textMuted,
    flex: 1,
    lineHeight: 18,
  },
});
