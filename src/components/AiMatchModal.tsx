import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import {
  Sparkles,
  X,
  Heart,
  MessageCircle,
  RefreshCw,
  CheckCircle2,
  BrainCircuit,
  Zap,
  Star,
  ShieldCheck,
} from 'lucide-react-native';
import { theme } from '../theme';
import { MOCK_PROFILES } from '../utils/mockData';

export interface AiMatchModalProps {
  visible: boolean;
  onClose: () => void;
  onConnect?: (profile: any) => void;
}

export const AiMatchModal: React.FC<AiMatchModalProps> = ({
  visible,
  onClose,
  onConnect,
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [matchIndex, setMatchIndex] = useState(0);
  const [scanStep, setScanStep] = useState(0);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const SCAN_MESSAGES = [
    'Analyzing core values & background...',
    'Evaluating career & lifestyle synergy...',
    'Matching interests & emotional compatibility...',
    'Calculating AI Match Score...',
  ];

  const currentMatch = MOCK_PROFILES[matchIndex % MOCK_PROFILES.length];
  const aiScore = 94 + ((matchIndex * 2) % 6); // 94%, 96%, 98% etc.

  useEffect(() => {
    if (visible) {
      runScanAnimation();
    }
  }, [visible, matchIndex]);

  const runScanAnimation = () => {
    setIsScanning(true);
    setScanStep(0);
    rotateAnim.setValue(0);
    scaleAnim.setValue(1);

    // Continuous pulse & rotate
    Animated.loop(
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Step text progress
    const interval = setInterval(() => {
      setScanStep(prev => {
        if (prev < SCAN_MESSAGES.length - 1) return prev + 1;
        clearInterval(interval);
        setTimeout(() => setIsScanning(false), 500);
        return prev;
      });
    }, 600);
  };

  const handleNextMatch = () => {
    setMatchIndex(prev => prev + 1);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Top Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.sparkleIconWrap}>
                <Sparkles size={20} color="#8B5CF6" />
              </View>
              <View>
                <Text style={styles.headerTitle}>AI Auto Matchmaker</Text>
                <Text style={styles.headerSub}>Smart Compatibility Engine</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>

          {isScanning ? (
            /* Scanning Animation View */
            <View style={styles.scanContainer}>
              <Animated.View
                style={[
                  styles.radarCircle,
                  { transform: [{ rotate: spin }, { scale: scaleAnim }] },
                ]}
              >
                <BrainCircuit size={54} color="#8B5CF6" />
              </Animated.View>

              <Text style={styles.scanningTitle}>Finding Best AI Matches</Text>
              <Text style={styles.scanningStatus}>{SCAN_MESSAGES[scanStep]}</Text>

              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${((scanStep + 1) / SCAN_MESSAGES.length) * 100}%` },
                  ]}
                />
              </View>
            </View>
          ) : (
            /* Match Result View */
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.resultScroll}>
              {/* Match Card Header */}
              <View style={styles.matchBadgeRow}>
                <View style={styles.aiMatchPill}>
                  <Zap size={14} color="#FFFFFF" fill="#FFFFFF" />
                  <Text style={styles.aiMatchPillText}>{aiScore}% AI Match Score</Text>
                </View>
                <Text style={styles.matchSubText}>Highest Compatibility Result</Text>
              </View>

              {/* Profile Card */}
              <View style={styles.profileCard}>
                <Image source={{ uri: currentMatch.image }} style={styles.profileImage} />
                <View style={styles.profileDetails}>
                  <View style={styles.nameRow}>
                    <Text style={styles.profileName}>
                      {currentMatch.name}, {currentMatch.age}
                    </Text>
                    {currentMatch.isVerified && (
                      <ShieldCheck size={20} color="#0D9488" fill="#CCFBF1" />
                    )}
                  </View>
                  <Text style={styles.profileSub}>{currentMatch.profession} • {currentMatch.location}</Text>
                </View>
              </View>

              {/* AI Reasoning Insights */}
              <Text style={styles.sectionHeading}>Why AI Picked This Match:</Text>

              <View style={styles.insightCard}>
                <View style={styles.insightIconWrap}>
                  <Star size={18} color="#8B5CF6" />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Values & Heritage</Text>
                  <Text style={styles.insightText}>100% Alignment in Religion ({currentMatch.religion}) & Family Values.</Text>
                </View>
              </View>

              <View style={styles.insightCard}>
                <View style={[styles.insightIconWrap, { backgroundColor: '#FCE7F3' }]}>
                  <Heart size={18} color="#EC4899" />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Lifestyle Harmony</Text>
                  <Text style={styles.insightText}>High overlap in bio preferences, social habits, & travel mindset.</Text>
                </View>
              </View>

              <View style={styles.insightCard}>
                <View style={[styles.insightIconWrap, { backgroundColor: '#CCFBF1' }]}>
                  <CheckCircle2 size={18} color="#0D9488" />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Career & Education Synergy</Text>
                  <Text style={styles.insightText}>Complementary professional background and long-term ambition.</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.connectBtn}
                  activeOpacity={0.85}
                  onPress={() => {
                    onConnect?.(currentMatch);
                    onClose();
                  }}
                >
                  <Heart size={20} color="#FFFFFF" fill="#FFFFFF" />
                  <Text style={styles.connectBtnText}>Connect Now</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.nextBtn}
                  activeOpacity={0.85}
                  onPress={handleNextMatch}
                >
                  <RefreshCw size={18} color="#8B5CF6" />
                  <Text style={styles.nextBtnText}>Next Match</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 30,
    ...theme.shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sparkleIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  headerSub: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  closeButton: {
    padding: 6,
  },
  scanContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
    gap: 20,
  },
  radarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C084FC',
  },
  scanningTitle: {
    fontFamily: theme.fonts.extraBold,
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 10,
  },
  scanningStatus: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: '#8B5CF6',
    textAlign: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#F3E8FF',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  resultScroll: {
    padding: 20,
    gap: 16,
  },
  matchBadgeRow: {
    alignItems: 'center',
    gap: 4,
  },
  aiMatchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    ...theme.shadows.sm,
  },
  aiMatchPillText: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  matchSubText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileDetails: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileName: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  profileSub: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  sectionHeading: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 4,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  insightIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  insightText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  connectBtn: {
    flex: 2,
    height: 52,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...theme.shadows.md,
  },
  connectBtnText: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nextBtn: {
    flex: 1,
    height: 52,
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#C084FC',
  },
  nextBtnText: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5CF6',
  },
});
