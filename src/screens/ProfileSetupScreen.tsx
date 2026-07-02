import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Camera, User, Calendar, Briefcase, BookOpen, Sparkles } from 'lucide-react-native';
import { theme } from '../theme';
import { DecorativeBackground } from '../components/DecorativeBackground';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../store/slices/authSlice';
import { saveAuthUser } from '../utils/authStorage';

const STEPS = ['Basic Info', 'About You'];

export const ProfileSetupScreen = () => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    age: '',
    religion: '',
    profession: '',
    bio: '',
  });

  const updateField = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const canProceed =
    step === 0
      ? form.name.trim() !== '' && form.age.trim() !== ''
      : form.religion.trim() !== '' && form.profession.trim() !== '';

  const handleFinish = async () => {
    const user = {
      id: Date.now().toString(),
      ...form,
    };
    await saveAuthUser(user);
    dispatch(loginSuccess(user));
  };

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else {
      handleFinish();
    }
  };

  return (
    <View style={styles.container}>
      <DecorativeBackground />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.progressRow}>
            {STEPS.map((label, index) => (
              <View key={label} style={styles.progressItem}>
                <View style={[styles.progressDot, index <= step && styles.progressDotActive]}>
                  <Text style={[styles.progressNumber, index <= step && styles.progressNumberActive]}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={[styles.progressLabel, index <= step && styles.progressLabelActive]}>
                  {label}
                </Text>
              </View>
            ))}
            <View style={[styles.progressLine, step >= 1 && styles.progressLineActive]} />
          </View>

          <View style={styles.header}>
            <View style={styles.sparkleRow}>
              <Sparkles size={18} color={theme.colors.secondary} />
              <Text style={styles.stepHint}>Step {step + 1} of 2</Text>
            </View>
            <Text style={styles.title}>
              {step === 0 ? 'Tell us about you' : 'Complete your profile'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 0
                ? 'A great profile helps you stand out'
                : 'Share a little more so matches know the real you'}
            </Text>
          </View>

          {step === 0 && (
            <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.8}>
              <View style={styles.avatarCircle}>
                <User size={40} color={theme.colors.primary} />
              </View>
              <View style={styles.cameraIcon}>
                <Camera size={14} color={theme.colors.white} />
              </View>
              <Text style={styles.avatarHint}>Add your best photo</Text>
            </TouchableOpacity>
          )}

          <View style={styles.formCard}>
            {step === 0 ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.inputContainer}>
                    <User size={20} color={theme.colors.primary} />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: Rohan Sharma"
                      placeholderTextColor={theme.colors.textMuted}
                      value={form.name}
                      onChangeText={val => updateField('name', val)}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Age</Text>
                  <View style={styles.inputContainer}>
                    <Calendar size={20} color={theme.colors.primary} />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: 26"
                      placeholderTextColor={theme.colors.textMuted}
                      keyboardType="number-pad"
                      value={form.age}
                      onChangeText={val => updateField('age', val)}
                    />
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Religion</Text>
                  <View style={styles.inputContainer}>
                    <BookOpen size={20} color={theme.colors.primary} />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: Hindu"
                      placeholderTextColor={theme.colors.textMuted}
                      value={form.religion}
                      onChangeText={val => updateField('religion', val)}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Profession</Text>
                  <View style={styles.inputContainer}>
                    <Briefcase size={20} color={theme.colors.primary} />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: Architect"
                      placeholderTextColor={theme.colors.textMuted}
                      value={form.profession}
                      onChangeText={val => updateField('profession', val)}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Bio</Text>
                  <TextInput
                    style={styles.bioInput}
                    placeholder="Tell us about yourself, hobbies, what you're looking for..."
                    placeholderTextColor={theme.colors.textMuted}
                    multiline
                    numberOfLines={4}
                    value={form.bio}
                    onChangeText={val => updateField('bio', val)}
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              style={[styles.button, !canProceed && styles.buttonDisabled]}
              onPress={handleNext}
              disabled={!canProceed}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>
                {step === 0 ? 'Continue' : 'Start Discovering'}
              </Text>
            </TouchableOpacity>

            {step === 1 && (
              <TouchableOpacity style={styles.backLink} onPress={() => setStep(0)}>
                <Text style={styles.backLinkText}>Go back</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 28,
    position: 'relative',
  },
  progressLine: {
    position: 'absolute',
    top: 16,
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor: theme.colors.border,
    zIndex: 0,
  },
  progressLineActive: {
    backgroundColor: theme.colors.primary,
  },
  progressItem: {
    alignItems: 'center',
    zIndex: 1,
    flex: 1,
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  progressNumber: {
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
  progressNumberActive: {
    color: theme.colors.white,
  },
  progressLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 6,
    fontWeight: '600',
  },
  progressLabelActive: {
    color: theme.colors.primary,
  },
  header: {
    marginBottom: 24,
  },
  sparkleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  stepHint: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.secondary,
    fontWeight: '600',
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
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginTop: 6,
    lineHeight: 22,
  },
  avatarContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.primaryMuted,
    ...theme.shadows.md,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 22,
    right: '35%',
    backgroundColor: theme.colors.secondary,
    padding: 8,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: theme.colors.white,
  },
  avatarHint: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 10,
  },
  formCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    padding: 22,
    ...theme.shadows.md,
  },
  inputGroup: {
    marginBottom: 18,
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
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.text,
  },
  bioInput: {
    height: 110,
    textAlignVertical: 'top',
    padding: 14,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
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
  backLink: {
    alignItems: 'center',
    marginTop: 14,
  },
  backLinkText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
});
