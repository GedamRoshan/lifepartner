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
} from 'react-native';
import Video from 'react-native-video';
import { Phone, ArrowRight, Shield, Heart, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { theme } from '../theme';

const TRUST_BADGES = [
  { icon: Shield, label: 'Verified Profiles' },
  { icon: Heart, label: '1M+ Matches' },
  { icon: Sparkles, label: 'Premium Experience' },
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

      <Video
        source={require('../assets/videos/lifepartner.mp4')}
        style={styles.backgroundVideo}
        muted
        repeat
        resizeMode="cover"
        rate={1.0}
        paused={false}
        playInBackground={false}
        playWhenInactive={false}
        shutterColor="transparent"
      />

      {/* Fallback gradient when video is loading or unavailable */}
      <View style={styles.fallbackBackground} />
      <View style={styles.overlay} />
      <View style={styles.gradientFade} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.hero}>
              <View style={styles.logoBadge}>
                <Heart size={18} color={theme.colors.white} fill={theme.colors.secondary} />
              </View>
              <Text style={styles.logo}>LifePartner</Text>
              <Text style={styles.subtitle}>Where meaningful connections begin</Text>

              <View style={styles.badgesRow}>
                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                  <View key={label} style={styles.trustBadge}>
                    <Icon size={14} color={theme.colors.accent} />
                    <Text style={styles.trustText}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.formCard}>
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
                <Phone
                  size={20}
                  color={isValid ? theme.colors.success : 'rgba(255,255,255,0.85)'}
                />
                <Text style={styles.prefix}>+91</Text>
                <View style={styles.inputDivider} />
                <TextInput
                  style={styles.input}
                  placeholder="9876543210"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  keyboardType="number-pad"
                  value={phone}
                  onChangeText={handlePhoneChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  maxLength={10}
                  selectionColor={theme.colors.secondary}
                  underlineColorAndroid="transparent"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  returnKeyType="done"
                />
                {isValid ? (
                  <CheckCircle2 size={22} color={theme.colors.success} />
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

              <TouchableOpacity
                style={[styles.button, isValid ? styles.buttonEnabled : styles.buttonDisabled]}
                onPress={() => navigation.navigate('OTP', { phone })}
                activeOpacity={0.85}
                disabled={!isValid}
              >
                <Text style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}>
                  Continue
                </Text>
                <ArrowRight
                  size={20}
                  color={isValid ? theme.colors.white : 'rgba(255,255,255,0.5)'}
                />
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>
              By continuing, you agree to our
              <Text style={styles.link}> Terms </Text>
              and
              <Text style={styles.link}> Privacy Policy</Text>
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0A1F',
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  fallbackBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2D1B3D',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  gradientFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'android' ? 24 : 16,
    paddingTop: 20,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(233,30,99,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  logo: {
    fontFamily: theme.fonts.bold,
    fontSize: 40,
    fontWeight: '900',
    color: theme.colors.white,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    textAlign: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 18,
    gap: 8,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    gap: 5,
  },
  trustText: {
    fontFamily: theme.fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  formTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.white,
  },
  formSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
    marginBottom: 20,
  },
  label: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  inputContainerFocused: {
    borderColor: theme.colors.secondary,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  inputContainerValid: {
    borderColor: theme.colors.success,
    backgroundColor: 'rgba(67,160,71,0.12)',
  },
  prefix: {
    fontFamily: theme.fonts.bold,
    fontSize: 17,
    color: theme.colors.white,
    marginLeft: 8,
  },
  inputDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.white,
    paddingVertical: 0,
    letterSpacing: 1,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  digitCount: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '600',
    minWidth: 36,
    textAlign: 'right',
  },
  helperText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 8,
    marginLeft: 4,
  },
  validText: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.success,
    marginTop: 8,
    marginLeft: 4,
    fontWeight: '600',
  },
  button: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  buttonEnabled: {
    backgroundColor: theme.colors.secondary,
    ...theme.shadows.lg,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  buttonText: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  buttonTextDisabled: {
    color: 'rgba(255,255,255,0.45)',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    fontFamily: theme.fonts.medium,
    marginHorizontal: 14,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  socialIcon: {
    width: 22,
    height: 22,
  },
  socialButtonText: {
    fontFamily: theme.fonts.medium,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.white,
  },
  footerText: {
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 17,
    marginTop: 18,
    paddingHorizontal: 10,
  },
  link: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.secondary,
    fontWeight: '700',
  },
});
