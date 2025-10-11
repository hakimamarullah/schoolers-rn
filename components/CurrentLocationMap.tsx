import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

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
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    let isMounted = true;
    
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (isMounted) setIsLoading(false);
          return;
        }
        
        if (!isMounted) return;

      
        const loc = await Location.getCurrentPositionAsync({ 
          accuracy: Location.Accuracy.Highest
        });
        
        const coords = { 
          latitude: loc.coords.latitude, 
          longitude: loc.coords.longitude 
        };

        
        if (isMounted) {
          setLocation(coords);
          setIsLoading(false);
          onLocationUpdate?.(coords);
        }

      
        Location.reverseGeocodeAsync(coords).then(reverse => {
          if (!isMounted) return;
          
          const addressObj = reverse[0];
          const address = addressObj
            ? `${addressObj.name ?? ""} ${addressObj.street ?? ""}, ${addressObj.subregion ?? ""}, ${addressObj.region ?? ""}`.trim()
            : undefined;

          const fullLocation = { ...coords, address };
          setLocation(fullLocation);
          onLocationUpdate?.(fullLocation);
        }).catch(err => {
          console.warn("Reverse geocoding failed:", err);
        });

      } catch (error) {
        console.error("Location fetch error:", error);
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => { isMounted = false; }; 
  }, []);

  if (isLoading || !location) {
    return <Text style={styles.loadingText}>Fetching location...</Text>;
  }

  return (
    <View style={styles.mapWrapper}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        loadingEnabled={false}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        showsUserLocation
        showsMyLocationButton={true}
        rotateEnabled={false}
        pitchEnabled={true}
      >
        <Marker 
          coordinate={location} 
          title="You are here" 
          description={location.address}
        />
      </MapView>
      {location.address && (
        <Text style={styles.addressText}>{location.address}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapWrapper: {
    alignItems: "center",
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
    paddingHorizontal: 16,
  },
});

export default CurrentLocationMap;