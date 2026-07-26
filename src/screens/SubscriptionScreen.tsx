import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {
  Crown,
  ChevronLeft,
  Check,
  Heart,
  MessageCircle,
  EyeOff,
  Shield,
  Filter,
  Zap,
  Star,
  Target,
  CheckCheck,
  Percent,
  Gem,
  Quote
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PLANS = [
  {
    id: 1,
    durationText: '12\nMonths',
    icon: Crown,
    price: '180',
    period: '/ for 1 months',
    total: '750',
    original: '1,800',
    save: 'Save 58%',
    color: '#FF3366',
    popular: true,
  },
  {
    id: 2,
    durationText: '3\nMonths',
    icon: Star,
    price: '350',
    period: '/ for 3 months',
    total: '350',
    original: '500',
    save: 'Save 30%',
    color: '#7E57C2',
    popular: false,
  },
  {
    id: 3,
    durationText: '12\nMonths',
    icon: Gem,
    price: '750',
    period: '/ for 12 months',
    total: '750',
    original: '1,800',
    save: 'Save 58%',
    color: '#7E57C2',
    popular: false,
  },
];

const FEATURES_INCLUDED = [
  { icon: Crown, label: 'Unlimited Likes\n& Interest' },
  { icon: Heart, label: 'See Who\nLiked You' },
  { icon: MessageCircle, label: 'Unlimited\nChat' },
  { icon: CheckCheck, label: 'Read\nReceipts' },
  { icon: EyeOff, label: 'Incognito\nMode' },
  { icon: Shield, label: 'Premium\nBadges' },
  { icon: Filter, label: 'Advanced\nFilters' },
  { icon: Zap, label: 'Profile Boost\n(3x/month)' },
];

const WHY_PREMIUM = [
  { icon: Heart, text: 'Get more matches and meaningful connections' },
  { icon: Star, text: 'Stand out with premium features' },
  { icon: Shield, text: 'Control your privacy and preferences' },
  { icon: Target, text: 'Increase your chances of finding the one' },
];

export const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const [selectedPlanId, setSelectedPlanId] = useState(1);
  const [timeLeft, setTimeLeft] = useState({ hrs: 23, mins: 59, secs: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hrs, mins, secs } = prev;
        if (secs > 0) secs--;
        else {
          secs = 59;
          if (mins > 0) mins--;
          else {
            mins = 59;
            if (hrs > 0) hrs--;
          }
        }
        return { hrs, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (val: number) => (val < 10 ? `0${val}` : val);

  const renderPaymentLogos = () => (
    <View style={styles.paymentLogosContainer}>
      <Text style={[styles.paymentLogoText, { color: '#000', fontWeight: '800', fontStyle: 'italic' }]}>UPI</Text>
      <Text style={[styles.paymentLogoText, { color: '#1A1F71', fontWeight: '800', fontStyle: 'italic' }]}>VISA</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={[styles.mastercardCircle, { backgroundColor: '#EB001B', right: -6 }]} />
        <View style={[styles.mastercardCircle, { backgroundColor: '#F79E1B' }]} />
      </View>
      <Text style={[styles.paymentLogoText, { color: '#002663', fontWeight: '800' }]}>RuPay</Text>
      <Text style={[styles.paymentLogoText, { color: '#00B9F1', fontWeight: '900', fontStyle: 'italic' }]}>Paytm</Text>
      <Text style={[styles.paymentLogoText, { color: '#5F6368', fontWeight: '700' }]}>G Pay</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <ChevronLeft size={24} color="#FF3366" strokeWidth={3} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscriptions</Text>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.restoreText}>Restore</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextContent}>
            <Text style={styles.heroTitle}>Go Premium 👑</Text>
            <Text style={styles.heroSubtitle}>
              Unlock meaningful connections and find your <Text style={{ color: '#FF3366', fontWeight: '700' }}>LifePartner</Text>
            </Text>
          </View>
          
          <View style={styles.crownVisualContainer}>
            {/* Simulated 3D Crown using layers since image isn't available */}
            <View style={styles.podiumBase} />
            <View style={styles.podiumTop} />
            <Text style={{ fontSize: 60, position: 'absolute', top: -30 }}>👑</Text>
            <Text style={styles.floatingHeart1}>💖</Text>
            <Text style={styles.floatingHeart2}>✨</Text>
          </View>
        </View>

        {/* Offer Banner */}
        <View style={styles.offerBanner}>
          <View style={styles.offerLeft}>
            <View style={styles.offerIconWrap}>
              <Percent size={18} color="#FF3366" strokeWidth={3} />
            </View>
            <View>
              <Text style={styles.offerTitle}>Limited Time Offer</Text>
              <Text style={styles.offerSub}>Get 50% OFF on all plans</Text>
            </View>
          </View>
          <View style={styles.timerBox}>
            <Text style={styles.timerText}>
              {formatTime(timeLeft.hrs)} <Text style={styles.timerColon}>:</Text> {formatTime(timeLeft.mins)} <Text style={styles.timerColon}>:</Text> {formatTime(timeLeft.secs)}
            </Text>
            <View style={styles.timerLabels}>
              <Text style={styles.timerLabelText}>HRS</Text>
              <Text style={styles.timerLabelText}>MINS</Text>
              <Text style={styles.timerLabelText}>SECS</Text>
            </View>
          </View>
        </View>

        {/* Plans */}
        <Text style={styles.sectionHeading}>Choose Your Plan</Text>
        <View style={styles.plansContainer}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  isSelected && styles.planCardSelected,
                ]}
                onPress={() => setSelectedPlanId(plan.id)}
                activeOpacity={0.9}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>Most Popular</Text>
                  </View>
                )}

                <View style={styles.planHeaderRow}>
                  <View style={[styles.planIconBox, { backgroundColor: plan.color }]}>
                    <plan.icon size={20} color="#FFF" />
                    <Text style={styles.planDurationText}>{plan.durationText}</Text>
                  </View>

                  <View style={styles.planDetails}>
                    <View style={styles.priceRow}>
                      <Text style={[styles.planCurrency, { color: plan.color }]}>₹</Text>
                      <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
                      <Text style={styles.planPeriod}>{plan.period}</Text>
                    </View>
                    <View style={styles.totalRow}>
                      <Text style={styles.totalText}>Total</Text>
                      <Text style={[styles.totalAmount, { color: plan.color }]}>₹{plan.total}</Text>
                      <Text style={styles.originalAmount}>₹{plan.original}</Text>
                    </View>
                  </View>

                  <View style={styles.planRight}>
                    <View style={styles.saveBadge}>
                      <Text style={styles.saveBadgeText}>{plan.save}</Text>
                    </View>
                    {!isSelected && (
                      <View style={styles.radioOutline} />
                    )}
                  </View>
                </View>

                {isSelected && plan.popular && (
                  <View style={styles.expandedContent}>
                    <View style={styles.featuresList}>
                      {[
                        'Unlimited Likes & Interest',
                        'See Who Liked You',
                        'Unlimited Chat',
                        'Read Receipts',
                        'Incognito Mode',
                        'Premium Badges',
                        'Advanced Filters',
                        'Profile Boost (3x/month)',
                        'Cancel Anytime'
                      ].map((feature, idx) => (
                        <View key={idx} style={styles.featureListItem}>
                          <View style={styles.checkCircleFill}>
                            <Check size={10} color="#FFF" strokeWidth={3} />
                          </View>
                          <Text style={styles.featureListText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                    <TouchableOpacity style={styles.choosePlanBtn} activeOpacity={0.85}>
                      <Text style={styles.choosePlanBtnText}>Choose Plan</Text>
                      <ChevronLeft size={20} color="#FFF" style={{ transform: [{ rotate: '180deg' }], position: 'absolute', right: 24 }} />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Features Included */}
        <Text style={styles.sectionHeading}>FEATURES INCLUDED</Text>
        <View style={styles.featuresGrid}>
          {FEATURES_INCLUDED.map((item, idx) => (
            <View key={idx} style={styles.gridItem}>
              <View style={styles.gridIconWrap}>
                <item.icon size={22} color="#FF3366" />
              </View>
              <Text style={styles.gridItemLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Why Go Premium */}
        <Text style={styles.sectionHeading}>WHY GO PREMIUM?</Text>
        <View style={styles.whyList}>
          {WHY_PREMIUM.map((item, idx) => (
            <View key={idx} style={styles.whyListItem}>
              <item.icon size={18} color="#7E57C2" />
              <Text style={styles.whyListText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Testimonial */}
        <View style={styles.testimonialCard}>
          <View style={styles.quoteIconWrap}>
            <Quote size={20} color="#FF3366" fill="#FF3366" />
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} color="#FFB800" fill="#FFB800" />
              ))}
            </View>
          </View>
          <Text style={styles.testimonialText}>
            Premium membership is totally worth it! I got more matches and found amazing people.
          </Text>
          <View style={styles.testimonialUser}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=47' }} style={styles.testimonialAvatar} />
            <View>
              <Text style={styles.testimonialName}>Priya S.</Text>
              <Text style={styles.testimonialRole}>Premium Member</Text>
            </View>
          </View>
        </View>

        {/* Security & Payment */}
        <View style={styles.securitySection}>
          <View style={styles.secureHeader}>
            <Shield size={16} color="#10B981" fill="#10B981" />
            <Text style={styles.secureTitle}>Secure Payment</Text>
          </View>
          <Text style={styles.secureDesc}>
            Your payment information is encrypted and secure
          </Text>

          <View style={styles.weAcceptLine}>
            <View style={styles.line} />
            <Text style={styles.weAcceptText}>We Accept</Text>
            <View style={styles.line} />
          </View>

          {renderPaymentLogos()}

          <Text style={styles.footerDisclaimer}>
            Recurring billing. Cancel anytime from Play Store / App Store{'\n'}
            Your subscription will auto-renew before the end of the current period.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // light background
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  restoreText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF3366',
  },

  heroSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  heroTextContent: {
    flex: 1,
    paddingRight: 10,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  crownVisualContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  podiumBase: {
    width: 80,
    height: 20,
    backgroundColor: '#FF6699',
    borderRadius: 40,
    transform: [{ scaleY: 0.5 }],
    position: 'absolute',
    bottom: -5,
  },
  podiumTop: {
    width: 70,
    height: 20,
    backgroundColor: '#FFB6C1',
    borderRadius: 35,
    transform: [{ scaleY: 0.5 }],
    position: 'absolute',
    bottom: 2,
  },
  floatingHeart1: {
    position: 'absolute',
    top: 10,
    right: -10,
    fontSize: 16,
  },
  floatingHeart2: {
    position: 'absolute',
    top: 20,
    left: -10,
    fontSize: 14,
  },

  offerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FCE4EC',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  offerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  offerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-10deg' }],
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF3366',
    marginBottom: 2,
  },
  offerSub: {
    fontSize: 12,
    color: '#666',
  },
  timerBox: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF3366',
  },
  timerColon: {
    color: '#666',
    fontWeight: '400',
  },
  timerLabels: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  timerLabelText: {
    fontSize: 8,
    color: '#666',
    fontWeight: '600',
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 24,
    marginBottom: 16,
    textTransform: 'uppercase',
  },

  plansContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  planCardSelected: {
    borderColor: '#FF3366',
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    backgroundColor: '#FF3366',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  planHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  planIconBox: {
    width: 56,
    height: 70,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  planDurationText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
  },
  planDetails: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  planCurrency: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 32,
  },
  planPeriod: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  totalText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  originalAmount: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  planRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
  },
  saveBadge: {
    backgroundColor: '#FCE4EC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  saveBadgeText: {
    color: '#FF3366',
    fontSize: 11,
    fontWeight: '700',
  },
  radioOutline: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  expandedContent: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 20,
  },
  featuresList: {
    gap: 10,
    marginBottom: 20,
  },
  featureListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCircleFill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF3366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureListText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  choosePlanBtn: {
    backgroundColor: '#FF3366',
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  choosePlanBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 16,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 40 - 48) / 4, // 4 items per row, gaps included
    alignItems: 'center',
  },
  gridIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridItemLabel: {
    fontSize: 11,
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
  },

  whyList: {
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 40,
  },
  whyListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  whyListText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },

  testimonialCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  quoteIconWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  testimonialText: {
    fontSize: 15,
    color: '#1A1A1A',
    lineHeight: 22,
    marginBottom: 20,
  },
  testimonialUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  testimonialName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  testimonialRole: {
    fontSize: 13,
    color: '#666',
  },

  securitySection: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  secureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  secureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  secureDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 24,
  },
  weAcceptLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  weAcceptText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#666',
  },
  paymentLogosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    flexWrap: 'wrap',
  },
  paymentLogoText: {
    fontSize: 12,
  },
  mastercardCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    opacity: 0.8,
  },
  footerDisclaimer: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
});
