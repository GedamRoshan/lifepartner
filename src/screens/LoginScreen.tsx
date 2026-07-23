import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Phone, ArrowRight, Shield, Heart, Crown, CheckCircle2, ChevronDown } from 'lucide-react-native';
import { theme } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TRUST_BADGES = [
  { icon: Shield, label: 'Verified Profiles' },
  { icon: Heart, label: '1M+ Matches' },
  { icon: Crown, label: 'Premium Experience' },
];

const formatPhoneDisplay = (digits: string) => {
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
};

export const LoginScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const isValid = phone.length === 10;
  const hasInput = phone.length > 0;

  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background Image */}
      <Image
        source={require('../assets/images/wedding.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Dark maroon overlay */}
      <View style={styles.overlay} />

      {/* Bottom gradient fade */}
      <View style={styles.gradientFade} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          {/* Hero Section - at the top */}
          <View style={styles.hero}>
            <View style={styles.logoBadge}>
              <Heart size={20} color="#FFFFFF" fill="#FF2D55" />
            </View>
            <Text style={styles.logo}>LifePartner</Text>
            <Text style={styles.subtitle}>Where meaningful connections begin</Text>

            <View style={styles.badgesRow}>
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <View key={label} style={styles.trustBadge}>
                  <Icon size={24} color="#FFFFFF" />
                  <Text style={styles.trustText}>{label.replace(' ', '\n')}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Bottom Sheet Form Panel */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.bottomSheet}
          >
            <ScrollView
              contentContainerStyle={styles.sheetScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <Text style={styles.formTitle}>Get Started</Text>
              <Text style={styles.formSubtitle}>Enter your mobile number to continue</Text>

              <Text style={styles.label}>Mobile Number</Text>
              <View
                style={[
                  styles.inputContainer,
                  isFocused && styles.inputContainerFocused,
                  isValid && styles.inputContainerValid,
                ]}
              >
                {/* +91 Dropdown prefix */}
                <View style={styles.prefixBox}>
                  <Text style={styles.prefix}>+91</Text>
                  <ChevronDown size={14} color="#FFFFFF" />
                </View>
                <View style={styles.inputDivider} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter mobile number"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  keyboardType="number-pad"
                  value={phone}
                  onChangeText={handlePhoneChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  maxLength={10}
                  selectionColor="#FF2D55"
                  underlineColorAndroid="transparent"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  returnKeyType="done"
                />
                {isValid ? (
                  <CheckCircle2 size={20} color="#43A047" />
                ) : hasInput ? (
                  <Text style={styles.digitCount}>{phone.length}/10</Text>
                ) : null}
              </View>

              {hasInput && !isValid && (
                <Text style={styles.helperText}>
                  Enter {10 - phone.length} more digit{10 - phone.length !== 1 ? 's' : ''}
                </Text>
              )}
              {isValid && (
                <Text style={styles.validText}>+91 {formatPhoneDisplay(phone)}</Text>
              )}

              {/* Continue Button */}
              <TouchableOpacity
                style={[styles.button, !isValid && styles.buttonDisabled]}
                onPress={() => navigation.navigate('OTP', { phone })}
                activeOpacity={0.85}
                disabled={!isValid}
              >
                <Text style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}>
                  Continue
                </Text>
                <ArrowRight
                  size={20}
                  color={isValid ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}
                />
              </TouchableOpacity>

              {/* OR Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              {/* Google Button */}
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <Text style={styles.footerText}>
                By continuing, you agree to our
                <Text style={styles.link}> Terms </Text>
                and
                <Text style={styles.link}> Privacy Policy</Text>
              </Text>
            </ScrollView>
          </KeyboardAvoidingView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D0B0B',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(60,5,15,0.50)',
  },
  gradientFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '20%',
    backgroundColor: 'rgba(40,0,10,0.30)',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // ── Hero ──────────────────────────────────────────
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FF2D55',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#FF2D55',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  logo: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 6,
    textAlign: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  trustBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(120, 20, 20, 0.4)',
    width: 90,
    height: 100,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    gap: 12,
  },
  trustText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },

  // ── Bottom Sheet Panel ────────────────────────────
  bottomSheet: {
    backgroundColor: 'rgba(90, 50, 50, 0.95)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderBottomWidth: 0,
  },
  sheetScroll: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: Platform.OS === 'android' ? 32 : 24,
  },
  formTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  formSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 28,
  },
  label: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  // ── Input ─────────────────────────────────────────
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  inputContainerFocused: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  inputContainerValid: {
    borderColor: '#43A047',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  prefixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 4,
  },
  prefix: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  inputDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 0,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  digitCount: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    minWidth: 34,
    textAlign: 'right',
  },
  helperText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#FF8888',
    marginTop: 6,
    marginLeft: 4,
  },
  validText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: '#43A047',
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '600',
  },

  // ── Button ────────────────────────────────────────
  button: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
    backgroundColor: '#E82B67',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(232, 43, 103, 0.5)',
  },
  buttonText: {
    fontFamily: theme.fonts.bold,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonTextDisabled: {
    color: 'rgba(255,255,255,0.7)',
  },

  // ── OR Divider ────────────────────────────────────
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    fontFamily: theme.fonts.medium,
    marginHorizontal: 14,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },

  // ── Google Button ─────────────────────────────────
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'transparent',
    gap: 12,
  },
  socialIcon: {
    width: 22,
    height: 22,
  },
  socialButtonText: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ── Footer ────────────────────────────────────────
  footerText: {
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
    marginTop: 32,
    paddingHorizontal: 10,
    paddingBottom: 4,
  },
  link: {
    fontFamily: theme.fonts.medium,
    color: '#E82B67',
    fontWeight: '600',
  },
});
