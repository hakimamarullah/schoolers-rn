import React, { useState, useCallback } from "react";
import { View, Image, StyleSheet, TouchableOpacity, ActionSheetIOS, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "@/hooks/useApp";

interface ProfilePickerProps {
  onImagePicked: (uri: string) => void;
  size?: number;
  defaultImageUri?: string;
}

const ProfilePicker = React.memo(({ onImagePicked, size = 120, defaultImageUri }: ProfilePickerProps) => {
  const [imageUri, setImageUri] = useState<string | null>(defaultImageUri || null);
  const app = useApp();

  const pickImage = useCallback(async () => {
    // Request both permissions upfront
    const [cameraPermission, libraryPermission] = await Promise.all([
      ImagePicker.requestCameraPermissionsAsync(),
      ImagePicker.requestMediaLibraryPermissionsAsync(),
    ]);

    const showOptions = async () => {
      const options = ['Cancel', 'Take Photo', 'Choose from Library'];
      const cancelButtonIndex = 0;

      // Using a promise-based approach for cross-platform
      const buttonIndex = await new Promise<number>((resolve) => {
        if (Platform.OS === 'ios') {
          ActionSheetIOS.showActionSheetWithOptions(
            { options, cancelButtonIndex },
            resolve
          );
        } else {
          // Android
          Alert.alert(
            'Select Photo',
            'Choose an option',
            [
              { text: 'Take Photo', onPress: () => resolve(1) },
              { text: 'Choose from Library', onPress: () => resolve(2) },
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(0) },
            ]
          );
        }
      });

      if (buttonIndex === 1) {
        await takePhoto();
      } else if (buttonIndex === 2) {
        await chooseFromLibrary();
      }
    };

    const takePhoto = async () => {
      if (cameraPermission.status !== 'granted') {
        app.showModal('Permission Denied', 'Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        onImagePicked(uri);
      }
    };

    const chooseFromLibrary = async () => {
      if (libraryPermission.status !== 'granted') {
        app.showModal('Permission Denied', 'Gallery permission is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        onImagePicked(uri);
      }
    };

    showOptions();
  }, [onImagePicked]);

  const iconSize = Math.max(size * 0.2, 24);
  const iconWrapperSize = Math.max(size * 0.25, 30);

  return (
    <TouchableOpacity onPress={pickImage} style={styles.container} activeOpacity={0.7}>
      <View style={[styles.profileWrapper, { width: size, height: size, borderRadius: size / 2 }]}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={[styles.profileImage, { width: size, height: size, borderRadius: size / 2 }]}
          />
        ) : (
          <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
            <MaterialIcons name="person" size={size * 0.5} color="#999" />
          </View>
        )}

        {/* Edit Icon */}
        <View 
          style={[
            styles.editIconWrapper, 
            { 
              width: iconWrapperSize, 
              height: iconWrapperSize, 
              borderRadius: iconWrapperSize / 2,
              top: 0,
              right: 0,
            }
          ]}
        >
          <MaterialIcons name="camera-alt" size={iconSize * 0.6} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: { 
    alignSelf: "center", 
    marginBottom: 20 
  },
  profileWrapper: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    position: "relative",
  },
  profileImage: { 
    resizeMode: "cover" 
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  editIconWrapper: {
    position: "absolute",
    backgroundColor: "#666",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
});

export default ProfilePicker;