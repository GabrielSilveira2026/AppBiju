import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DayType } from '@/src/types/types';
import { colors } from '@/styles/color';

export default function DayListItem({ day }: { day: DayType }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{new Date(day.data_dia_producao).toLocaleDateString()}</Text>
      <Text style={styles.text}>{`R$${day.valor_dia.toFixed(2)}`}</Text>
      <Ionicons name="arrow-forward" size={45} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  text: {
    color: colors.text,
    fontSize: 16,
  },
});
