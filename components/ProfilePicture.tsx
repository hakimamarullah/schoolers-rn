import React, { memo } from "react";
import { Image, StyleSheet } from "react-native";

const ProfilePicture = ({ uri = 'https://avatar.iran.liara.run/public/73'}: { uri?: string }) => (
  <Image source={{ uri }} style={styles.profileImage} />
);

export default memo(ProfilePicture);

const styles = StyleSheet.create({
  profileImage: { width: 60, height: 60, borderRadius: 30 },
});
