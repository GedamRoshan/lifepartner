import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Camera, User, Calendar, Briefcase, BookOpen, Sparkles, X } from 'lucide-react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { theme } from '../theme';
import { DecorativeBackground } from '../components/DecorativeBackground';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { ChipSelector } from '../components/ChipSelector';
import { SelectPickerModal } from '../components/SelectPickerModal';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../store/slices/authSlice';
import { saveAuthUser } from '../utils/authStorage';

const STEPS = ['Basic Info', 'About You'];
const PROFILE_FOR_OPTIONS = ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative', 'Friend'];
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const RELIGIONS = ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Buddhist', 'Jain', 'Other'];
const PROFESSIONS = ['Software Engineer', 'Doctor', 'Teacher', 'Architect', 'Business', 'Finance', 'Student', 'Other'];

export const ProfileSetupScreen = () => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [form, setForm] = useState({
    profileFor: 'Self',
    name: '',
    gender: 'Male',
    age: '',
    religion: '',
    profession: '',
    bio: '',
  });
  
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownType, setDropdownType] = useState<'religion' | 'profession' | null>(null);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'LifePartner needs access to your camera to take profile photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: false,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          setPhotos(prev => [...prev, uri].slice(0, 10));
        }
      }
    );
  };

  const handleSelectFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 10 - photos.length,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        const uris = response.assets?.map(asset => asset.uri).filter(Boolean) as string[];
        if (uris && uris.length > 0) {
          setPhotos(prev => [...prev, ...uris].slice(0, 10));
        }
      }
    );
  };

  const handleAddPhoto = () => {
    if (photos.length >= 10) {
      Alert.alert('Limit Reached', 'You can upload up to 10 photos.');
      return;
    }
    Alert.alert(
      'Add Photo',
      'Choose source',
      [
        {
          text: 'Take Photo',
          onPress: handleTakePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: handleSelectFromGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleRemovePhoto = (index: number) => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        {
          text: 'Remove',
          onPress: () => {
            setPhotos(prev => prev.filter((_, i) => i !== index));
          },
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const generateAiBio = () => {
    if (!form.bio.trim()) {
      Alert.alert('Add some info', 'Please write a few words about yourself first so AI can enhance it!');
      return;
    }
    setIsGeneratingBio(true);
    setTimeout(() => {
      // Mock AI enhancement
      const enhancedBio = `Hi there! I am a passionate and driven person. ${form.bio} I love exploring new ideas and enjoying the journey of life. Looking forward to finding a meaningful connection!`;
      updateField('bio', enhancedBio);
      setIsGeneratingBio(false);
    }, 1500);
  };

  const canProceed =
    step === 0
      ? form.name.trim() !== '' && form.age.trim() !== '' && form.gender !== '' && form.profileFor !== '' && photos.length > 0
      : form.religion.trim() !== '' && form.profession.trim() !== '';

  const handleFinish = async () => {
    const user = {
      id: Date.now().toString(),
      ...form,
      photos,
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
            <View style={styles.photosWrapper}>
              <Text style={styles.photoHeader}>Add Photos (Up to 10)</Text>
              <Text style={styles.photoSubheader}>Add at least 1 photo. The first one is your profile picture.</Text>
              
              {/* Main Photo Slot */}
              <TouchableOpacity
                style={[
                  styles.mainPhotoSlot,
                  photos[0] && styles.photoSlotFilled
                ]}
                onPress={() => photos[0] ? handleRemovePhoto(0) : handleAddPhoto()}
                activeOpacity={0.85}
              >
                {photos[0] ? (
                  <>
                    <Image source={{ uri: photos[0] }} style={styles.photoImage} />
                    <View style={styles.removeBadge}>
                      <X size={14} color={theme.colors.white} strokeWidth={3} />
                    </View>
                  </>
                ) : (
                  <View style={styles.addContent}>
                    <Camera size={32} color={theme.colors.primary} />
                    <Text style={styles.addLabelMain}>Upload Main Profile Photo</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Other 9 Photo Slots */}
              <View style={styles.photoGrid}>
                {Array.from({ length: 9 }).map((_, i) => {
                  const index = i + 1;
                  const photoUri = photos[index];
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.photoSlot,
                        photoUri && styles.photoSlotFilled
                      ]}
                      onPress={() => photoUri ? handleRemovePhoto(index) : handleAddPhoto()}
                      activeOpacity={0.8}
                    >
                      {photoUri ? (
                        <>
                          <Image source={{ uri: photoUri }} style={styles.photoImage} />
                          <View style={styles.removeBadgeSmall}>
                            <X size={10} color={theme.colors.white} strokeWidth={3} />
                          </View>
                        </>
                      ) : (
                        <View style={styles.addContent}>
                          <Camera size={18} color={theme.colors.primary} />
                          <Text style={styles.addLabel}>+</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.formCard}>
            {step === 0 ? (
              <>
                <ChipSelector
                  label="Profile Created For"
                  options={PROFILE_FOR_OPTIONS}
                  selectedValue={form.profileFor}
                  onSelect={option => {
                    updateField('profileFor', option);
                    if (option === 'Son' || option === 'Brother') updateField('gender', 'Male');
                    if (option === 'Daughter' || option === 'Sister') updateField('gender', 'Female');
                  }}
                />

                <AppInput
                  label="Full Name"
                  placeholder="Ex: Rohan Sharma"
                  value={form.name}
                  onChangeText={val => updateField('name', val)}
                  icon={<User size={20} color={theme.colors.primary} />}
                />

                <ChipSelector
                  label="Gender"
                  options={[
                    { label: '♂ Male', value: 'Male' },
                    { label: '♀ Female', value: 'Female' },
                    { label: 'Other', value: 'Other' },
                  ]}
                  selectedValue={form.gender}
                  onSelect={val => updateField('gender', val)}
                  fullWidth
                />

                <AppInput
                  label="Age"
                  placeholder="Ex: 26"
                  keyboardType="number-pad"
                  value={form.age}
                  onChangeText={val => updateField('age', val)}
                  icon={<Calendar size={20} color={theme.colors.primary} />}
                />
              </>
            ) : (
              <>
                <AppInput
                  label="Religion"
                  placeholder="Ex: Hindu"
                  value={form.religion}
                  isTouchable
                  onPressContainer={() => {
                    setDropdownType('religion');
                    setDropdownVisible(true);
                  }}
                  icon={<BookOpen size={20} color={theme.colors.primary} />}
                />

                <AppInput
                  label="Profession"
                  placeholder="Ex: Architect"
                  value={form.profession}
                  isTouchable
                  onPressContainer={() => {
                    setDropdownType('profession');
                    setDropdownVisible(true);
                  }}
                  icon={<Briefcase size={20} color={theme.colors.primary} />}
                />

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Bio</Text>
                  <View style={styles.bioContainer}>
                    <TextInput
                      style={styles.bioInput}
                      placeholder="Tell us about yourself, hobbies, what you're looking for..."
                      placeholderTextColor={theme.colors.textMuted}
                      multiline
                      numberOfLines={4}
                      value={form.bio}
                      onChangeText={val => updateField('bio', val)}
                    />
                    <TouchableOpacity 
                      style={styles.aiButton} 
                      onPress={generateAiBio}
                      disabled={isGeneratingBio}
                      activeOpacity={0.8}
                    >
                      {isGeneratingBio ? (
                        <ActivityIndicator size="small" color={theme.colors.white} />
                      ) : (
                        <>
                          <Sparkles size={14} color={theme.colors.white} />
                          <Text style={styles.aiButtonText}>AI Magic</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            <AppButton
              title={step === 0 ? 'Continue' : 'Start Discovering'}
              onPress={handleNext}
              disabled={!canProceed}
            />

            {step === 1 && (
              <TouchableOpacity style={styles.backLink} onPress={() => setStep(0)}>
                <Text style={styles.backLinkText}>Go back</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <SelectPickerModal
        visible={dropdownVisible}
        title={`Select ${dropdownType === 'religion' ? 'Religion' : 'Profession'}`}
        options={dropdownType === 'religion' ? RELIGIONS : PROFESSIONS}
        selectedValue={form[dropdownType!]}
        onSelect={val => updateField(dropdownType!, val)}
        onClose={() => setDropdownVisible(false)}
      />
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
    fontFamily: theme.fonts.extraBold,
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
  photosWrapper: {
    marginBottom: 24,
    width: '100%',
  },
  photoHeader: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
  },
  photoSubheader: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 16,
  },
  mainPhotoSlot: {
    alignSelf: 'center',
    width: '90%',
    height: 180,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 16,
    overflow: 'hidden',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
    width: '100%',
    paddingHorizontal: 12,
  },
  photoSlot: {
    width: '30%',
    height: 85,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  photoSlotFilled: {
    borderStyle: 'solid',
    borderColor: theme.colors.primary,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.error,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  removeBadgeSmall: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.colors.error,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  addContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addLabelMain: {
    fontSize: 13,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  addLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.extraBold,
    color: theme.colors.primary,
    fontWeight: '800',
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
  inputText: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.text,
  },
  inputTextPlaceholder: {
    color: theme.colors.textMuted,
  },
  bioContainer: {
    position: 'relative',
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
    padding: 14,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.text,
    paddingBottom: 45, // leave space for ai button
  },
  aiButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    ...theme.shadows.sm,
  },
  aiButtonText: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: theme.colors.white,
    fontWeight: '700',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdownSheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '60%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...theme.shadows.lg,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dropdownTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: '700',
  },
  dropdownItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropdownItemText: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.text,
  },
  dropdownItemTextSelected: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
    fontWeight: '700',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderChip: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  genderChipText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  genderChipTextActive: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
    fontWeight: '700',
  },
});
