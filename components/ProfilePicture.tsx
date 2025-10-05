import React, { memo } from "react";
import { Image, StyleSheet, ImageStyle } from "react-native";

interface ProfilePictureProps {
  uri?: string;
  size?: number; // optional size
}

const ProfilePicture = ({ uri = 'https://avatar.iran.liara.run/public/73', size = 60 }: ProfilePictureProps) => {
  const dynamicStyle: ImageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return <Image source={{ uri }} style={[styles.profileImage, dynamicStyle]} />;
};

export default memo(ProfilePicture);

const styles = StyleSheet.create({
  profileImage: {
    resizeMode: "cover",
  },
});
