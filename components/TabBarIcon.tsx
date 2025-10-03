import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

export default function TabBarIcon({ name, focused }: { name: any; focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Ionicons 
        name={name} 
        size={24} 
        color={focused ? '#000' : '#806B00'} 
      />
    </View>
  );
}


const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});