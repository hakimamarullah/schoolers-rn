import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ScheduleCardProps {
  title: string;
  room: string;
  teachers: string;
  datetime: string;
  onPress?: () => void;
}

export function ScheduleCard({ 
  title, 
  room, 
  teachers, 
  datetime, 
  onPress 
}: ScheduleCardProps) {
  return (
    <TouchableOpacity 
      style={styles.scheduleCard} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Card Title Section - White background */}
      <View style={styles.cardHeader}>
        <Text style={styles.scheduleTitle}>{title}</Text>
      </View>
      
      {/* Card Content Section - Cream/Tint background */}
      <View style={styles.cardContent}>
        <View style={styles.scheduleDetails}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Room</Text>
            <Text style={styles.detailValue}>{room}</Text>
            
            <Text style={[styles.detailLabel, styles.marginTop]}>
              Datetime
            </Text>
            <Text style={styles.detailValue}>{datetime}</Text>
          </View>

          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Teachers</Text>
            <Text style={styles.detailValue}>{teachers}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scheduleCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cardContent: {
    backgroundColor: '#FFFBEA',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  scheduleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailColumn: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    fontWeight: '500',
  },
  marginTop: {
    marginTop: 10,
  },
});