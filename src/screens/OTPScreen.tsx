import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';
import { theme } from '../theme';
import { DecorativeBackground } from '../components/DecorativeBackground';

export const OTPScreen = ({ navigation, route }: any) => {
  const { phone } = route.params || { phone: '9876543210' };
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);
  const isComplete = otp.every(digit => digit !== '');

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (isComplete) {
      navigation.navigate('ProfileSetup');
    }
  };

  return (
    <View style={styles.container}>
      <DecorativeBackground />

      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={26} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <ShieldCheck size={32} color={theme.colors.primary} />
          </View>

          <Text style={styles.title}>Verify your number</Text>
          <Text style={styles.subtitle}>
            We sent a 4-digit code to{'\n'}
            <Text style={styles.phone}>+91 {phone}</Text>
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={el => {
                  inputs.current[index] = el;
                }}
                style={[styles.otpInput, digit !== '' && styles.otpInputFilled]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={value => handleOtpChange(value, index)}
                onKeyPress={e => handleKeyPress(e, index)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, !isComplete && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={!isComplete}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Verify & Continue</Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <TouchableOpacity>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSoft,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    marginLeft: 16,
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 30,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginTop: 10,
    lineHeight: 24,
  },
  phone: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 36,
    gap: 12,
  },
  otpInput: {
    flex: 1,
    height: 64,
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: theme.colors.border,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.primary,
    ...theme.shadows.sm,
  },
  otpInputFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryMuted,
  },
  button: {
    backgroundColor: theme.colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 28,
    gap: 6,
  },
  resendText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  resendLink: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.secondary,
    fontWeight: '700',
    fontSize: 15,
  },
});
