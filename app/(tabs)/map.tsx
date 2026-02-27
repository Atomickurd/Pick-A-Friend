import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import { useMapStore } from '../../store/map';
import { useUserStore } from '../../store/user';
import { DogPin } from '../../components/map/DogPin';
import { BusinessPin } from '../../components/map/BusinessPin';
import { LostPin } from '../../components/map/LostPin';
import { FilterBar } from '../../components/map/FilterBar';
import { DogProfileSheet } from '../../components/map/DogProfileSheet';
import { listenNearbyDogLocations } from '../../services/firebase/firestore';
import { encodeGeohash } from '../../services/geohash';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import type { DogProfile, DogLocation, MatchScore } from '../../types';

const INITIAL_REGION = {
  latitude: 51.5074,
  longitude: -0.1278,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const sheetRef = useRef<BottomSheet>(null);

  const { pins, filter, showBusinesses, showLostDogs, setSelectedPinId } = useMapStore();
  const user = useUserStore((s) => s.user);

  const [region, setRegion] = useState(INITIAL_REGION);
  const [dogLocations, setDogLocations] = useState<DogLocation[]>([]);
  const [selectedDog, setSelectedDog] = useState<DogProfile | null>(null);
  const [selectedMatchScore, setSelectedMatchScore] = useState<MatchScore | null>(null);

  // Subscribe to nearby dog locations
  useEffect(() => {
    if (!region) return;
    const geohashPrefix = encodeGeohash(region.latitude, region.longitude, 6);
    const unsub = listenNearbyDogLocations(geohashPrefix, setDogLocations);
    return unsub;
  }, [Math.floor(region.latitude * 100), Math.floor(region.longitude * 100)]);

  function handleDogPinPress(loc: DogLocation) {
    setSelectedPinId(loc.dogId);
    sheetRef.current?.snapToIndex(0);
    // In prod, fetch full DogProfile from Firestore here
    // For now we create a minimal stub so the sheet shows
    setSelectedDog({
      id: loc.dogId,
      ownerUid: loc.ownerUid,
      name: 'Loading...',
      breed: '',
      gender: 'male',
      dateOfBirth: new Date().toISOString(),
      weightKg: 0,
      size: 'medium',
      photoURLs: [],
      bio: '',
      traits: [],
      badges: [],
      energyLevel: 'medium',
      dogSocialPref: 'loves',
      humanSocialPref: 'loves',
      isNeutered: false,
      isMicrochipped: false,
      vaccinated: false,
      moodStatus: loc.moodStatus,
      moodUpdatedAt: loc.updatedAt,
      isActive: true,
      createdAt: '',
      updatedAt: loc.updatedAt,
    });
    setSelectedMatchScore(null);
  }

  function closeSheet() {
    sheetRef.current?.close();
    setSelectedDog(null);
    setSelectedPinId(null);
  }

  // Determine which dog pins pass the current filter
  const visibleDogLocations = dogLocations.filter((loc) => {
    if (loc.ownerUid === user?.uid) return false; // hide own pin
    const genderOk =
      filter.gender.length === 0; // without full profile data we skip gender filter
    return genderOk;
  });

  return (
    <View style={styles.screen}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {visibleDogLocations.map((loc) => (
          <Marker
            key={loc.dogId}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            onPress={() => handleDogPinPress(loc)}
            tracksViewChanges={false}
          >
            <DogPin
              name={loc.dogId.split('_')[0] ?? 'Dog'}
              photoURL={null}
              moodStatus={loc.moodStatus}
              isBirthday={loc.isBirthday}
              onPress={() => handleDogPinPress(loc)}
            />
          </Marker>
        ))}

        {showBusinesses &&
          pins
            .filter((p) => p.type === 'business')
            .map((p) => {
              if (p.type !== 'business') return null;
              return (
                <Marker
                  key={p.businessId}
                  coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                  tracksViewChanges={false}
                >
                  <BusinessPin
                    category={p.category}
                    name={p.name}
                    onPress={() => {}}
                  />
                </Marker>
              );
            })}

        {showLostDogs &&
          pins
            .filter((p) => p.type === 'lost')
            .map((p) => {
              if (p.type !== 'lost') return null;
              return (
                <Marker
                  key={p.reportId}
                  coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                  tracksViewChanges={false}
                >
                  <LostPin dogName={p.dogName} onPress={() => {}} />
                </Marker>
              );
            })}
      </MapView>

      {/* Filter bar */}
      <SafeAreaView style={styles.topOverlay} pointerEvents="box-none">
        <View style={styles.filterCard}>
          <FilterBar />
        </View>
      </SafeAreaView>

      {/* Recenter button */}
      <TouchableOpacity
        style={styles.recenterBtn}
        onPress={() => mapRef.current?.animateToRegion(INITIAL_REGION)}
      >
        <Text style={styles.recenterIcon}>📍</Text>
      </TouchableOpacity>

      {/* Dog profile bottom sheet */}
      <DogProfileSheet
        dog={selectedDog}
        matchScore={selectedMatchScore}
        onClose={closeSheet}
        bottomSheetRef={sheetRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  filterCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recenterBtn: {
    position: 'absolute',
    bottom: 120,
    right: SPACING.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  recenterIcon: { fontSize: 22 },
});
