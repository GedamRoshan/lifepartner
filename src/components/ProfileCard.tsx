import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { MapPin, Briefcase, BadgeCheck, Sparkles, X, Send, MessageCircle, User, ShieldCheck } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface ProfileCardProps {
  profile: {
    name: string;
    age: number;
    profession: string;
    religion: string;
    bio: string;
    location: string;
    image: string;
    distance?: number;
    isVerified?: boolean;
    isAadhaarVerified?: boolean;
    createdFor?: string;
    profileFor?: string;
  };
  onAction?: (type: 'like' | 'dislike') => void;
  onPressProfile?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onAction, onPressProfile }) => {
  const navigation = useNavigation();
  const createdByText = profile.createdFor || profile.profileFor || 'Self';
  const isAadhaar = profile.isAadhaarVerified ?? profile.isVerified ?? true;

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.95} 
      onPress={onPressProfile}
    >
      <Image source={{ uri: profile.image }} style={styles.image} />

      <View style={styles.topBadges}>
        <View style={styles.leftBadgesContainer}>
          {isAadhaar && (
            <View style={styles.aadhaarBadge}>
              <ShieldCheck size={14} color="#FFFFFF" />
              <Text style={styles.aadhaarText}>Aadhaar Verified</Text>
            </View>
          )}
          {profile.isVerified && !isAadhaar && (
            <View style={styles.verifiedBadge}>
              <BadgeCheck size={14} color="#FFFFFF" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
        <View style={styles.rightBadgesContainer}>
          <View style={styles.createdForBadge}>
            <User size={12} color="#FFFFFF" />
            <Text style={styles.createdForText}>Profile by {createdByText}</Text>
          </View>
          {profile.distance != null && (
            <View style={styles.distanceBadge}>
              <MapPin size={12} color="#FFFFFF" />
              <Text style={styles.distanceText}>{profile.distance} km away</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.gradientOverlay}>
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#000000" stopOpacity="0" />
              <Stop offset="0.4" stopColor="#000000" stopOpacity="0.4" />
              <Stop offset="1" stopColor="#000000" stopOpacity="0.9" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>
      
      <View style={styles.contentOverlay}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>
            {profile.name}, {profile.age}
          </Text>
          {isAadhaar && (
            <ShieldCheck size={22} color="#0D9488" fill="#CCFBF1" style={{ marginLeft: 6, marginTop: 4 }} />
          )}
        </View>

        <View style={styles.infoRow}>
          <Briefcase size={16} color="#FF6B9D" />
          <Text style={styles.infoText}>{profile.profession}</Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={16} color="#FF6B9D" />
          <Text style={styles.infoText}>{profile.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Sparkles size={16} color="#FF6B9D" />
          <Text style={styles.infoText}>{profile.religion}</Text>
        </View>

        <View style={styles.infoRow}>
          <User size={16} color="#FF6B9D" />
          <Text style={styles.infoText}>Profile managed by {createdByText}</Text>
        </View>

        <Text style={styles.bio} numberOfLines={3}>
          {profile.bio}
        </Text>

        <View style={styles.actionContainer}>
          <View style={styles.actionItem}>
            <TouchableOpacity style={styles.actionButtonMedium} onPress={() => onAction?.('dislike')} activeOpacity={0.85}>
              <X size={28} color="#FF2D55" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.actionLabelPrimary}>Ignore</Text>
          </View>
          
          <View style={styles.actionItem}>
            <TouchableOpacity style={styles.actionButtonLarge} onPress={() => onAction?.('like')} activeOpacity={0.85}>
              <Send size={28} color="#FF2D55" strokeWidth={2.5} style={{ marginLeft: -2, marginTop: 2 }} />
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.actionLabelPrimary}>Interest Sent</Text>
          </View>

          <View style={styles.actionItem}>
            <TouchableOpacity 
              style={styles.actionButtonMedium} 
              activeOpacity={0.85}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('ChatConversation', { chatName: profile.name, avatar: profile.image });
              }}
            >
              <MessageCircle size={28} color="#7C3AED" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.actionLabelPrimary}>Chat</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    height: height * 0.72,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topBadges: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  leftBadgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aadhaarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D9488',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  aadhaarText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  verifiedText: {
    fontFamily: 'Poppins-Medium', // Assuming we map to system if unavailable, but stick to standard fallback if needed. I'll use standard RN fonts
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  rightBadgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  createdForBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(233, 30, 99, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  createdForText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  infoText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '500',
  },
  bio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 16,
    lineHeight: 22,
    paddingRight: 20,
    marginBottom: 24,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 'auto',
  },
  actionItem: {
    alignItems: 'center',
    width: 80,
  },
  actionButtonMedium: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 10,
  },
  actionButtonLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF2D55',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 10,
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF2D55',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  actionLabelPrimary: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
