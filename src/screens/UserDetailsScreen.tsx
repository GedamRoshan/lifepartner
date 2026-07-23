import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MapPin, Briefcase, BadgeCheck, Sparkles, ChevronLeft } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export const UserDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { profile } = route.params || {};
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!profile) return null;

  // Mocking multiple images for demonstration if they don't exist
  const images = profile.images || [
    profile.image,
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80'
  ];

  const onScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setCurrentImageIndex(Math.round(index));
  };

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          bounces={false}
          style={styles.imageScroll}
        >
          {images.map((img: string, idx: number) => (
            <Image key={idx} source={{ uri: img }} style={styles.image} />
          ))}
        </ScrollView>
        
        <View style={styles.paginationContainer}>
          {images.map((_: any, idx: number) => (
            <View
              key={idx}
              style={[
                styles.dot,
                currentImageIndex === idx ? styles.activeDot : styles.inactiveDot
              ]}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <ChevronLeft size={28} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
        
        <View style={styles.topBadges}>
          {profile.isVerified ? (
            <View style={styles.verifiedBadge}>
              <BadgeCheck size={14} color="#FFFFFF" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          ) : (
            <View />
          )}
          {profile.distance != null && (
            <View style={styles.distanceBadge}>
              <MapPin size={12} color="#FFFFFF" />
              <Text style={styles.distanceText}>{profile.distance} km away</Text>
            </View>
          )}
        </View>
        <View style={styles.gradientOverlay}>
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#000000" stopOpacity="0" />
                <Stop offset="0.4" stopColor="#000000" stopOpacity="0.4" />
                <Stop offset="1" stopColor="#000000" stopOpacity="0.8" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#grad2)" />
          </Svg>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>
            {profile.name}, {profile.age}
          </Text>
          {profile.isVerified && (
            <BadgeCheck size={24} color="#2196F3" fill="#FFFFFF" style={{ marginLeft: 6, marginTop: 4 }} />
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Briefcase size={20} color="#FF2D55" />
            <Text style={styles.infoText}>{profile.profession}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MapPin size={20} color="#FF2D55" />
            <Text style={styles.infoText}>{profile.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Sparkles size={20} color="#FF2D55" />
            <Text style={styles.infoText}>{profile.religion}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{profile.bio}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  imageContainer: {
    width: width,
    height: height * 0.55,
    position: 'relative',
  },
  imageScroll: {
    width: width,
    height: '100%',
  },
  image: {
    width: width,
    height: '100%',
    resizeMode: 'cover',
  },
  paginationContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    zIndex: 10,
  },
  dot: {
    width: 32,
    height: 4,
    borderRadius: 2,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  topBadges: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    gap: 8,
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
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
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
    height: '40%',
  },
  contentContainer: {
    padding: 24,
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
});
