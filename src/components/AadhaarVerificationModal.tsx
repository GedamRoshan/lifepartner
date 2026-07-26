import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ShieldCheck, X, FileText, CheckCircle2, CreditCard, ArrowRight } from 'lucide-react-native';
import { theme } from '../theme';

export interface AadhaarVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AadhaarVerificationModal: React.FC<AadhaarVerificationModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'number' | 'otp' | 'success'>('number');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const formatAadhaar = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 12);
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    }
    return cleaned;
  };

  const handleSendOtp = () => {
    const rawNumber = aadhaarNumber.replace(/\s/g, '');
    if (rawNumber.length !== 12) {
      Alert.alert('Invalid Aadhaar', 'Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter 6-digit OTP sent to linked mobile number.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    }, 1500);
  };

  const handleClose = () => {
    setStep('number');
    setAadhaarNumber('');
    setOtp('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose} />
      <View style={styles.sheetContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <ShieldCheck size={26} color="#0D9488" />
            <Text style={styles.title}>Aadhaar Verification</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <X size={22} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {step === 'number' && (
          <View style={styles.body}>
            <Text style={styles.description}>
              Verify your profile with Aadhaar to get a 100% Verified Badge and 5x more responses!
            </Text>

            <View style={styles.cardPreview}>
              <CreditCard size={32} color="#0D9488" />
              <View>
                <Text style={styles.cardTitle}>Government ID Trust Badge</Text>
                <Text style={styles.cardSubtitle}>Your Aadhaar details remain 100% private & secure</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>12-Digit Aadhaar Number</Text>
              <View style={styles.inputContainer}>
                <FileText size={20} color={theme.colors.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="XXXX XXXX XXXX"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={14}
                  value={aadhaarNumber}
                  onChangeText={txt => setAadhaarNumber(formatAadhaar(txt))}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.actionBtn, aadhaarNumber.replace(/\s/g, '').length !== 12 && styles.btnDisabled]}
              onPress={handleSendOtp}
              disabled={aadhaarNumber.replace(/\s/g, '').length !== 12 || loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <>
                  <Text style={styles.btnText}>Get OTP for Verification</Text>
                  <ArrowRight size={20} color={theme.colors.white} />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {step === 'otp' && (
          <View style={styles.body}>
            <Text style={styles.description}>
              Enter the 6-digit OTP sent to your Aadhaar-linked mobile number.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enter 6-Digit OTP</Text>
              <TextInput
                style={styles.otpInput}
                placeholder="• • • • • •"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />
            </View>

            <TouchableOpacity
              style={[styles.actionBtn, otp.length !== 6 && styles.btnDisabled]}
              onPress={handleVerifyOtp}
              disabled={otp.length !== 6 || loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.btnText}>Verify & Complete Badge</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendBtn} onPress={() => setStep('number')}>
              <Text style={styles.resendText}>Change Aadhaar Number</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'success' && (
          <View style={styles.successBody}>
            <CheckCircle2 size={64} color="#0D9488" />
            <Text style={styles.successTitle}>Aadhaar Verified!</Text>
            <Text style={styles.successSubtitle}>
              Congratulations! Your profile has received the official Government ID Verified Badge.
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetContainer: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    ...theme.shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    gap: 18,
  },
  description: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  cardPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  cardTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  cardSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
  },
  inputGroup: {
    marginTop: 4,
  },
  label: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    gap: 10,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    letterSpacing: 2,
    color: theme.colors.text,
  },
  otpInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    height: 54,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    textAlign: 'center',
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    letterSpacing: 8,
    color: theme.colors.text,
  },
  actionBtn: {
    backgroundColor: '#0D9488',
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    ...theme.shadows.md,
  },
  btnDisabled: {
    opacity: 0.45,
  },
  btnText: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
  resendBtn: {
    alignItems: 'center',
    marginTop: 8,
  },
  resendText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  successBody: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 14,
  },
  successTitle: {
    fontFamily: theme.fonts.extraBold,
    fontSize: 24,
    fontWeight: '800',
    color: '#065F46',
  },
  successSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
