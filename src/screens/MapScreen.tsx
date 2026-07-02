import React, { useMemo } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { MapPin, Navigation } from 'lucide-react-native';
import { theme } from '../theme';
import { MOCK_PROFILES } from '../utils/mockData';

const MARKER_OFFSETS = [
  { lat: 0.012, lng: -0.018 },
  { lat: -0.008, lng: 0.022 },
  { lat: 0.018, lng: 0.008 },
  { lat: -0.015, lng: -0.012 },
];

export const MapScreen = () => {
  const initialRegion = {
    latitude: 19.076,
    longitude: 72.8777,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const markers = useMemo(
    () =>
      MOCK_PROFILES.map((profile, index) => ({
        ...profile,
        coordinate: {
          latitude: initialRegion.latitude + MARKER_OFFSETS[index].lat,
          longitude: initialRegion.longitude + MARKER_OFFSETS[index].lng,
        },
      })),
    [],
  );

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion} customMapStyle={mapStyle}>
        {markers.map(profile => (
          <Marker key={profile.id} coordinate={profile.coordinate} title={profile.name}>
            <View style={styles.markerContainer}>
              <Image source={{ uri: profile.image }} style={styles.markerImage} />
              <View style={styles.markerRing} />
            </View>
            <Callout tooltip>
              <View style={styles.callout}>
                <Image source={{ uri: profile.image }} style={styles.calloutImage} />
                <Text style={styles.calloutName}>{profile.name}, {profile.age}</Text>
                <Text style={styles.calloutInfo}>{profile.profession}</Text>
                <View style={styles.calloutDistance}>
                  <MapPin size={12} color={theme.colors.primary} />
                  <Text style={styles.calloutDistanceText}>{profile.distance} km away</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <SafeAreaView style={styles.header}>
        <View style={styles.titleCard}>
          <Navigation size={18} color={theme.colors.primary} />
          <View>
            <Text style={styles.title}>Nearby</Text>
            <Text style={styles.subtitle}>{MOCK_PROFILES.length} profiles around you</Text>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.bottomCard}>
        <Text style={styles.bottomTitle}>Tap a profile to view details</Text>
        <View style={styles.avatarRow}>
          {MOCK_PROFILES.map(profile => (
            <Image key={profile.id} source={{ uri: profile.image }} style={styles.bottomAvatar} />
          ))}
        </View>
      </View>
    </View>
  );
};

const mapStyle = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  titleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    gap: 12,
    alignSelf: 'flex-start',
    ...theme.shadows.md,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  markerContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: theme.colors.secondary,
  },
  markerImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  callout: {
    backgroundColor: theme.colors.white,
    padding: 12,
    borderRadius: 16,
    width: 160,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  calloutImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
  },
  calloutName: {
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  calloutInfo: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  calloutDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    backgroundColor: theme.colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  calloutDistanceText: {
    fontFamily: theme.fonts.medium,
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  bottomTitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: -8,
  },
  bottomAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.colors.white,
    marginHorizontal: 4,
  },
});
