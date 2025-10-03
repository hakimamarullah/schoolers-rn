import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface DaySelectorProps {
  days: string[];
  activeDay: number;
  onDayChange: (index: number) => void;
}

export function DaySelector({ days, activeDay, onDayChange }: DaySelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.daysContainer}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={day}
            onPress={() => onDayChange(index)}
            style={styles.dayItem}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.dayText,
                activeDay === index && styles.dayTextActive,
              ]}
            >
              {day}
            </Text>
            {activeDay === index && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
  },
  daysContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  dayItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  dayTextActive: {
    color: '#000',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FFD800',
    borderRadius: 2,
  },
});