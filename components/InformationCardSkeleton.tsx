// components/InformationCardSkeleton.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function InformationCardSkeleton() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.icon, { opacity }]} />
      <View style={styles.textContainer}>
        <Animated.View style={[styles.title, { opacity }]} />
        <Animated.View style={[styles.content, { opacity }]} />
        <Animated.View style={[styles.contentShort, { opacity }]} />
      </View>
      <Animated.View style={[styles.date, { opacity }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 10,
    flexShrink: 1,
  },
  title: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    width: '80%',
  },
  content: {
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 4,
    width: '100%',
  },
  contentShort: {
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '60%',
  },
  date: {
    width: 50,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginLeft: 5,
  },
});