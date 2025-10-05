import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");

interface CurrentLocationMapProps {
  onLocationUpdate?: (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
}

const CurrentLocationMap: React.FC<CurrentLocationMapProps> = ({ onLocationUpdate }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
  const mapRef = useRef<MapView>(null);

 useEffect(() => {
  let isMounted = true;
  (async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted" || !isMounted) return;

    const loc = await Location.getCurrentPositionAsync({});
    const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };

    const reverse = await Location.reverseGeocodeAsync(coords);
    const addressObj = reverse[0];
    const address = addressObj
      ? `${addressObj.name ?? ""} ${addressObj.street ?? ""}, ${addressObj.subregion ?? ""}, ${addressObj.region ?? ""}`
      : undefined;

    if (isMounted) {
      const fullLocation = { ...coords, address };
      setLocation(fullLocation);
      onLocationUpdate?.(fullLocation);

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0015,
          longitudeDelta: 0.0015,
        }, 1000);
      }
    }
  })();

  return () => { isMounted = false; }; 
}, []);


  if (!location) return <Text style={styles.loadingText}>Fetching location...</Text>;

  return (
    <View style={styles.mapWrapper}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        showsUserLocation
      >
        <Marker coordinate={location} title="You are here" description={location.address} />
      </MapView>
      {location.address && <Text style={styles.addressText}>{location.address}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  mapWrapper: {
    alignItems: "center", // centers map horizontally
    marginBottom: 16,
  },
  map: {
    width: width - 32,
    height: 200,
    borderRadius: 12,
  },
  loadingText: {
    textAlign: "center",
    color: "#999",
    marginVertical: 16,
  },
  addressText: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});

export default CurrentLocationMap;
