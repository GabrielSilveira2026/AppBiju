import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DayType } from '@/src/types/types';
import { colors } from '@/styles/color';
import { router } from 'expo-router';
import { globalStyles } from '@/styles/styles';

export default function DayListItem({ day }: { day: DayType }) {

  return (
    <TouchableOpacity activeOpacity={0.7} style={[globalStyles.cardContainer, styles.container]}
      onPress={() => {
        router.navigate({
          pathname: '../../(tabs)/day',
          params: {
            id_dia: day.id_dia,
            data_dia_producao: day.data_dia_producao,
            id_pessoa: day.id_pessoa,
            pessoa: day.pessoa,
            valor_dia: day.valor_dia?.toFixed(2),
          },
        });
      }}>
      <Text style={styles.text}>{new Date(day.data_dia_producao).toLocaleDateString("pt-BR", { timeZone: "UTC", })}</Text>
      <Text style={styles.text}>{`R$${day.valor_dia?.toFixed(2)}`}</Text>
      <Ionicons
        name="arrow-forward"
        size={45}
        color={colors.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  text: {
    color: colors.text,
    fontSize: 16,
  },
});
