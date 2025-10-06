import React from "react";
import { View, StyleSheet, ImageStyle } from "react-native";
import { Image } from "expo-image";

interface ProfilePictureProps {
  uri?: string;
  size?: number;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  uri = "https://avatar.iran.liara.run/public/73",
  size = 60,
}) => {
  const dynamicStyle: ImageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View style={[styles.container, dynamicStyle]}>
      <Image
        source={{ uri }}
        style={[styles.image, dynamicStyle]}
        placeholder={require("@/assets/images/avatar-placeholder.jpg")}
        placeholderContentFit="cover"
        contentFit="cover"
        transition={300} // smooth fade-in animation
        cachePolicy="disk" // caches both memory and disk
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ProfilePicture;
