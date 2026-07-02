import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { MapPin, Briefcase, BadgeCheck, Sparkles } from 'lucide-react-native';
import { theme } from '../theme';

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
  };
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: profile.image }} style={styles.image} />

      <View style={styles.topBadges}>
        {profile.isVerified && (
          <View style={styles.verifiedBadge}>
            <BadgeCheck size={14} color={theme.colors.white} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
        {profile.distance != null && (
          <View style={styles.distanceBadge}>
            <MapPin size={12} color={theme.colors.white} />
            <Text style={styles.distanceText}>{profile.distance} km</Text>
          </View>
        )}
      </View>

      <View style={styles.gradientOverlay} />
      <View style={styles.contentOverlay}>
        <View style={styles.tagRow}>
          <View style={styles.religionTag}>
            <Sparkles size={12} color={theme.colors.accent} />
            <Text style={styles.religionText}>{profile.religion}</Text>
          </View>
        </View>

        <Text style={styles.name}>
          {profile.name}, {profile.age}
        </Text>

        <View style={styles.infoRow}>
          <Briefcase size={15} color="rgba(255,255,255,0.9)" />
          <Text style={styles.infoText}>{profile.profession}</Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={15} color="rgba(255,255,255,0.9)" />
          <Text style={styles.infoText}>{profile.location}</Text>
        </View>

        <Text style={styles.bio} numberOfLines={2}>
          {profile.bio}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.92,
    height: height * 0.62,
    borderRadius: 28,
    backgroundColor: theme.colors.card,
    overflow: 'hidden',
    ...theme.shadows.card,
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
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  verifiedText: {
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    color: theme.colors.white,
    fontWeight: '700',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  distanceText: {
    fontFamily: theme.fonts.medium,
    fontSize: 11,
    color: theme.colors.white,
    fontWeight: '600',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'transparent',
    // Simulated gradient with layered views
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 22,
    paddingTop: 60,
    backgroundColor: 'rgba(0,0,0,0.52)',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  religionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(156,39,176,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  religionText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.white,
    fontWeight: '600',
  },
  name: {
    fontFamily: theme.fonts.bold,
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.white,
    letterSpacing: -0.3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  infoText: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.92)',
  },
  bio: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
    marginTop: 10,
    lineHeight: 19,
  },
});
