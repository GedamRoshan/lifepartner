import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import {
  ChevronLeft,
  User,
  MapPin,
  BookOpen,
  Briefcase,
  Heart,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Save,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginSuccess } from '../store/slices/authSlice';
import { saveAuthUser } from '../utils/authStorage';
import { updateUserProfileApi } from '../services/apiService';

// Option constants
const GENDERS = ['Male', 'Female', 'Other'];
const MARITAL_STATUSES = ['Never Married', 'Divorced', 'Widowed', 'Separated'];
const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Other'];
const MOTHER_TONGUES = ['Hindi', 'English', 'Marathi', 'Gujarati', 'Punjabi', 'Tamil', 'Telugu', 'Malayalam'];
const MANGLIK_OPTIONS = ['Yes', 'No', "Don't Know"];
const QUALIFICATIONS = ['School', 'Diploma', 'Bachelor', 'Master', 'Doctorate', 'College', 'Other'];
const DIET_OPTIONS = ['Veg', 'Non Veg', 'Vegan'];
const HABIT_OPTIONS = ['Yes', 'No', 'Occasionally'];
const EXERCISE_OPTIONS = ['Daily', 'Weekly', 'Rarely', 'Never'];

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.user);

  // Form State
  const [form, setForm] = useState({
    // Personal
    firstName: currentUser?.name?.split(' ')[0] || '',
    lastName: currentUser?.name?.split(' ')[1] || '',
    gender: currentUser?.gender || 'Male',
    dob: currentUser?.dob || '',
    height: currentUser?.height || '',
    weight: currentUser?.weight || '',
    maritalStatus: currentUser?.maritalStatus || 'Never Married',
    
    // Location
    country: currentUser?.country || 'India',
    state: currentUser?.state || '',
    city: currentUser?.city || currentUser?.location || '',
    address: currentUser?.address || '',
    pincode: currentUser?.pincode || '',
    liveLocationEnabled: currentUser?.liveLocationEnabled || false,

    // Religion & Background
    religion: currentUser?.religion || 'Hindu',
    motherTongue: currentUser?.motherTongue || 'Hindi',
    caste: currentUser?.caste || '',
    subCaste: currentUser?.subCaste || '',
    manglik: currentUser?.manglik || 'No',

    // Education & Career
    highestQualification: currentUser?.highestQualification || 'College',
    occupation: currentUser?.profession || '',
    company: currentUser?.company || '',
    designation: currentUser?.designation || '',
    annualIncome: currentUser?.annualIncome || '',
    experience: currentUser?.experience || '',
    workLocation: currentUser?.workLocation || '',

    // Lifestyle
    diet: currentUser?.diet || 'Veg',
    smoking: currentUser?.smoking || 'No',
    drinking: currentUser?.drinking || 'No',
    exercise: currentUser?.exercise || 'Weekly',

    // Bio
    bio: currentUser?.bio || '',
  });

  // Modal selector state
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    title: string;
    options: string[];
    field: keyof typeof form;
  }>({
    visible: false,
    title: '',
    options: [],
    field: 'gender',
  });

  const updateField = (field: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Auto calculate age from DOB if format DD/MM/YYYY or YYYY-MM-DD
  const calculateAge = (dobString: string) => {
    if (!dobString) return currentUser?.age || '--';
    const parts = dobString.split(/[\/\-]/);
    if (parts.length === 3) {
      let year = parseInt(parts[2]);
      if (parts[0].length === 4) year = parseInt(parts[0]);
      if (!isNaN(year) && year > 1940 && year < 2026) {
        return 2026 - year;
      }
    }
    return currentUser?.age || '--';
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    const requiredFields: (keyof typeof form)[] = [
      'firstName', 'gender', 'dob', 'height', 'maritalStatus',
      'country', 'state', 'city', 'religion', 'motherTongue',
      'highestQualification', 'occupation'
    ];
    let filled = 0;
    requiredFields.forEach(f => {
      if (form[f] && String(form[f]).trim() !== '') filled++;
    });
    return Math.round((filled / requiredFields.length) * 100);
  };

  const openPicker = (title: string, options: string[], field: keyof typeof form) => {
    setModalConfig({ visible: true, title, options, field });
  };

  const handleSave = async () => {
    if (!form.firstName.trim()) {
      Alert.alert('Required Field', 'Please enter your First Name.');
      return;
    }

    const fullName = `${form.firstName} ${form.lastName}`.trim();
    const calculatedAge = calculateAge(form.dob);

    const updatedUser = {
      ...currentUser,
      ...form,
      name: fullName,
      age: calculatedAge !== '--' ? Number(calculatedAge) : currentUser?.age || 25,
      profession: form.occupation || currentUser?.profession,
      location: `${form.city}${form.state ? ', ' + form.state : ''}`,
      profileCompletion: calculateCompletion(),
    };

    // Send payload to central API service endpoint
    await updateUserProfileApi(updatedUser);

    await saveAuthUser(updatedUser);
    dispatch(loginSuccess(updatedUser));

    Alert.alert('Success 🎉', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const completionPercent = calculateCompletion();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Matrimony Profile</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Save size={18} color="#FFF" />
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Completion Bar */}
        <View style={styles.completionCard}>
          <View style={styles.completionHeader}>
            <View style={styles.completionTitleWrap}>
              <Sparkles size={18} color={theme.colors.primary} />
              <Text style={styles.completionTitle}>Profile Completion</Text>
            </View>
            <Text style={styles.completionPercent}>{completionPercent}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${completionPercent}%` }]} />
          </View>
          <Text style={styles.completionSubtext}>
            {completionPercent === 100 
              ? 'Great job! Your profile is 100% complete.' 
              : 'Fill all required fields to get maximum matches.'}
          </Text>
        </View>

        {/* SECTION 1: Personal Details */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <User size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Personal Details</Text>
          </View>

          {/* First Name & Last Name */}
          <View style={styles.rowTwo}>
            <View style={styles.flex1}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Rohan"
                value={form.firstName}
                onChangeText={v => updateField('firstName', v)}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Sharma"
                value={form.lastName}
                onChangeText={v => updateField('lastName', v)}
              />
            </View>
          </View>

          {/* Gender */}
          <Text style={styles.label}>Gender *</Text>
          <View style={styles.chipRow}>
            {GENDERS.map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.chip, form.gender === g && styles.chipActive]}
                onPress={() => updateField('gender', g)}
              >
                <Text style={[styles.chipText, form.gender === g && styles.chipTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* DOB & Age */}
          <View style={styles.rowTwo}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Date of Birth *</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={form.dob}
                onChangeText={v => updateField('dob', v)}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Age (Auto)</Text>
              <View style={[styles.input, styles.readOnlyInput]}>
                <Text style={styles.readOnlyText}>{calculateAge(form.dob)} Yrs</Text>
              </View>
            </View>
          </View>

          {/* Height & Weight */}
          <View style={styles.rowTwo}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Height *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 5 ft 8 in"
                value={form.height}
                onChangeText={v => updateField('height', v)}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Weight (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 68 kg"
                value={form.weight}
                onChangeText={v => updateField('weight', v)}
              />
            </View>
          </View>

          {/* Marital Status */}
          <Text style={styles.label}>Marital Status *</Text>
          <TouchableOpacity 
            style={styles.selectInput}
            onPress={() => openPicker('Marital Status', MARITAL_STATUSES, 'maritalStatus')}
          >
            <Text style={styles.selectInputText}>{form.maritalStatus}</Text>
            <ChevronDown size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* SECTION 2: Location Details */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Location Details</Text>
          </View>

          <View style={styles.rowTwo}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Country *</Text>
              <TextInput
                style={styles.input}
                placeholder="India"
                value={form.country}
                onChangeText={v => updateField('country', v)}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>State *</Text>
              <TextInput
                style={styles.input}
                placeholder="Maharashtra"
                value={form.state}
                onChangeText={v => updateField('state', v)}
              />
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={styles.flex1}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="Mumbai"
                value={form.city}
                onChangeText={v => updateField('city', v)}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Pincode</Text>
              <TextInput
                style={styles.input}
                placeholder="400001"
                keyboardType="number-pad"
                value={form.pincode}
                onChangeText={v => updateField('pincode', v)}
              />
            </View>
          </View>

          <Text style={styles.label}>Current Address (Optional)</Text>
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="House no, Street, Landmark..."
            multiline
            value={form.address}
            onChangeText={v => updateField('address', v)}
          />

          <TouchableOpacity 
            style={styles.locationToggleRow}
            onPress={() => updateField('liveLocationEnabled', !form.liveLocationEnabled)}
            activeOpacity={0.8}
          >
            <MapPin size={18} color={form.liveLocationEnabled ? theme.colors.primary : '#64748B'} />
            <Text style={styles.locationToggleText}>Enable Live Location (Optional)</Text>
            <View style={[styles.toggleDot, form.liveLocationEnabled && styles.toggleDotActive]} />
          </TouchableOpacity>
        </View>

        {/* SECTION 3: Religion & Cultural */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Religion & Culture</Text>
          </View>

          <View style={styles.rowTwo}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Religion *</Text>
              <TouchableOpacity 
                style={styles.selectInput}
                onPress={() => openPicker('Religion', RELIGIONS, 'religion')}
              >
                <Text style={styles.selectInputText}>{form.religion}</Text>
                <ChevronDown size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.flex1}>
              <Text style={styles.label}>Mother Tongue *</Text>
              <TouchableOpacity 
                style={styles.selectInput}
                onPress={() => openPicker('Mother Tongue', MOTHER_TONGUES, 'motherTongue')}
              >
                <Text style={styles.selectInputText}>{form.motherTongue}</Text>
                <ChevronDown size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Caste</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Brahmin"
                value={form.caste}
                onChangeText={v => updateField('caste', v)}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Sub Caste</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Deshastha"
                value={form.subCaste}
                onChangeText={v => updateField('subCaste', v)}
              />
            </View>
          </View>

          <Text style={styles.label}>Manglik *</Text>
          <View style={styles.chipRow}>
            {MANGLIK_OPTIONS.map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.chip, form.manglik === m && styles.chipActive]}
                onPress={() => updateField('manglik', m)}
              >
                <Text style={[styles.chipText, form.manglik === m && styles.chipTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SECTION 4: Education & Career */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Briefcase size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Education & Career</Text>
          </View>

          <Text style={styles.label}>Highest Qualification *</Text>
          <TouchableOpacity 
            style={styles.selectInput}
            onPress={() => openPicker('Highest Qualification', QUALIFICATIONS, 'highestQualification')}
          >
            <Text style={styles.selectInputText}>{form.highestQualification}</Text>
            <ChevronDown size={18} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.rowTwo}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Occupation *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Software Engineer"
                value={form.occupation}
                onChangeText={v => updateField('occupation', v)}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Company</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Google / TCS"
                value={form.company}
                onChangeText={v => updateField('company', v)}
              />
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Designation</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Senior Dev"
                value={form.designation}
                onChangeText={v => updateField('designation', v)}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Annual Income</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: ₹12 Lakhs"
                value={form.annualIncome}
                onChangeText={v => updateField('annualIncome', v)}
              />
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Experience</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 4 Years"
                value={form.experience}
                onChangeText={v => updateField('experience', v)}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Work Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Mumbai"
                value={form.workLocation}
                onChangeText={v => updateField('workLocation', v)}
              />
            </View>
          </View>
        </View>

        {/* SECTION 5: Lifestyle & Habits */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Heart size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Lifestyle & Habits</Text>
          </View>

          {/* Diet */}
          <Text style={styles.label}>Diet</Text>
          <View style={styles.chipRow}>
            {DIET_OPTIONS.map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.chip, form.diet === d && styles.chipActive]}
                onPress={() => updateField('diet', d)}
              >
                <Text style={[styles.chipText, form.diet === d && styles.chipTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Smoking */}
          <Text style={styles.label}>Smoking</Text>
          <View style={styles.chipRow}>
            {HABIT_OPTIONS.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, form.smoking === s && styles.chipActive]}
                onPress={() => updateField('smoking', s)}
              >
                <Text style={[styles.chipText, form.smoking === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Drinking */}
          <Text style={styles.label}>Drinking</Text>
          <View style={styles.chipRow}>
            {HABIT_OPTIONS.map(dr => (
              <TouchableOpacity
                key={dr}
                style={[styles.chip, form.drinking === dr && styles.chipActive]}
                onPress={() => updateField('drinking', dr)}
              >
                <Text style={[styles.chipText, form.drinking === dr && styles.chipTextActive]}>{dr}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Exercise */}
          <Text style={styles.label}>Exercise</Text>
          <View style={styles.chipRow}>
            {EXERCISE_OPTIONS.map(e => (
              <TouchableOpacity
                key={e}
                style={[styles.chip, form.exercise === e && styles.chipActive]}
                onPress={() => updateField('exercise', e)}
              >
                <Text style={[styles.chipText, form.exercise === e && styles.chipTextActive]}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.mainSaveBtn} onPress={handleSave} activeOpacity={0.85}>
          <CheckCircle2 size={22} color="#FFF" />
          <Text style={styles.mainSaveBtnText}>Complete Profile (Save)</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Selector Modal */}
      <Modal visible={modalConfig.visible} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          onPress={() => setModalConfig(prev => ({ ...prev, visible: false }))} 
          activeOpacity={1} 
        />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Select {modalConfig.title}</Text>
          <FlatList
            data={modalConfig.options}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  updateField(modalConfig.field, item);
                  setModalConfig(prev => ({ ...prev, visible: false }));
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  form[modalConfig.field] === item && styles.modalOptionSelected
                ]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  completionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  completionTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  completionPercent: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  completionSubtext: {
    fontSize: 12,
    color: '#64748B',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
  },
  readOnlyInput: {
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  readOnlyText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  selectInput: {
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectInputText: {
    fontSize: 14,
    color: '#0F172A',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  locationToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  locationToggleText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
  },
  toggleDotActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  mainSaveBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  mainSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '50%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#334155',
  },
  modalOptionSelected: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});
