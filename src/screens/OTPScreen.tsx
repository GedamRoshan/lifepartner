import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { ChevronLeft, ShieldCheck, Pencil, ArrowRight, MessageSquare, Lock, Heart } from 'lucide-react-native';
import { theme } from '../theme';

export const OTPScreen = ({ navigation, route }: any) => {
  const { phone } = route.params || { phone: '9876543210' };
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 digits
  const inputs = useRef<Array<TextInput | null>>([]);
  const isComplete = otp.every(digit => digit !== '');
  const [timer, setTimer] = useState(28);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
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
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#FF2D55" />
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <Heart size={36} color="#FF2D55" strokeWidth={3} />
          <Text style={styles.logoText}>LifePartner</Text>
          <Text style={styles.logoSubText}>Where meaningful connections begin</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Verify Your Number</Text>
          <Text style={styles.subtitle}>We've sent a 6-digit verification code to</Text>
          
          <View style={styles.phoneRow}>
            <Text style={styles.phone}>+91 {phone.replace(/(\d{5})(\d{5})/, '$1 $2')}</Text>
            <TouchableOpacity style={styles.editIcon}>
              <Pencil size={14} color="#FF2D55" />
            </TouchableOpacity>
          </View>

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
                selectionColor="#FF2D55"
              />
            ))}
          </View>
          <Text style={styles.otpHelper}>Enter the 6-digit code</Text>

          <View style={styles.infoBox}>
            <ShieldCheck size={20} color="#FF2D55" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Your privacy and security</Text>
              <Text style={styles.infoDesc}>are our top priority.</Text>
            </View>
          </View>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <Text style={styles.resendLinkContainer}>
              <Text style={styles.resendText}>Resend code in </Text>
              <Text style={styles.resendTimer}>{formatTime(timer)}</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, !isComplete && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={!isComplete}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Verify & Continue</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.smsButton} activeOpacity={0.85}>
            <MessageSquare size={18} color="#FF2D55" />
            <Text style={styles.smsButtonText}>Verify with SMS</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Lock size={14} color="#666666" />
            <Text style={styles.footerText}>We never share your number with anyone.</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7', // Very light pink background
  },
  safeArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFE8F0',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoText: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 8,
  },
  logoSubText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    alignItems: 'center',
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  phone: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: '#FF2D55',
    fontWeight: '600',
  },
  editIcon: {
    padding: 4,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
  },
  otpInput: {
    width: 45,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE8F0',
    textAlign: 'center',
    fontSize: 24,
    color: '#FF2D55',
    fontFamily: theme.fonts.medium,
  },
  otpInputFilled: {
    borderColor: '#FF2D55',
  },
  otpHelper: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#666666',
    marginTop: 12,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 32,
    width: '100%',
    justifyContent: 'center',
    gap: 12,
  },
  infoTextContainer: {
    alignItems: 'flex-start',
  },
  infoTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  infoDesc: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#666666',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
    gap: 4,
  },
  resendText: {
    fontFamily: theme.fonts.regular,
    color: '#666666',
    fontSize: 13,
  },
  resendLinkContainer: {
    flexDirection: 'row',
  },
  resendTimer: {
    fontFamily: theme.fonts.bold,
    color: '#FF2D55',
    fontWeight: '700',
    fontSize: 13,
  },
  button: {
    backgroundColor: '#FF2D55',
    width: '100%',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: theme.fonts.bold,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFE8F0',
  },
  dividerText: {
    fontFamily: theme.fonts.medium,
    marginHorizontal: 16,
    color: '#666666',
    fontSize: 12,
  },
  smsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFE8F0',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  smsButtonText: {
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    fontWeight: '600',
    color: '#FF2D55',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    gap: 6,
  },
  footerText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#666666',
  },
});
