import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import NotificationIcon from "./NotificationIcon";

export interface NotificationInfo {
  title?: string;
  hasRead?: boolean;
  date?: string;
  content?: string;
  id: any;
}

interface NotificationCardProps {
  data?: NotificationInfo;
  onPress?: (it: NotificationInfo | undefined) => void;
}

function InformationCardComponent({ data, onPress }: NotificationCardProps) {
  const { title = "", hasRead = false, date = "", content = "" } = data || {};

  return (
    <View style={styles.container}>
      <NotificationIcon hasRead={hasRead} />
      <View style={styles.textContainer}>
        <Pressable onPress={() => onPress?.(data)}>
          <Text
            style={[
              styles.title,
              hasRead ? styles.titleRead : styles.titleUnread,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </Pressable>
        <Text style={styles.content} numberOfLines={2} ellipsizeMode="tail">
          {content}
        </Text>
      </View>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
}


const InformationCard = React.memo(
  InformationCardComponent,
  (prevProps, nextProps) => {
    const prev = prevProps.data;
    const next = nextProps.data;
   
    return (
      prev?.id === next?.id &&
      prev?.title === next?.title &&
      prev?.hasRead === next?.hasRead &&
      prev?.date === next?.date &&
      prev?.content === next?.content
    );
  }
);

export default InformationCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 10,
    flexShrink: 1,
  },
  title: {
    fontSize: 14,
    marginBottom: 2,
  },
  titleUnread: {
    fontWeight: "bold",
    color: "#000",
  },
  titleRead: {
    fontWeight: "normal",
    color: "#000",
  },
  content: {
    fontSize: 13,
    color: "#555",
  },
  date: {
    fontSize: 11,
    color: "#999",
    marginLeft: 5,
    flexShrink: 0,
  },
});
