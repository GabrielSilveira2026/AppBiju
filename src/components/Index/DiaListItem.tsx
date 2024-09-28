import { colors } from '@/styles/color'
import { Ionicons } from '@expo/vector-icons'
import { View, Text, StyleSheet } from 'react-native'

export default function DiaListItem() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>10/08/24</Text>
      <Text style={styles.text}>R$100,00</Text>
      <Ionicons name="arrow-forward" size={45} color={colors.primary}/>
    </View>
  )
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
        borderBottomColor: "white"
    },
    text:{
        color: colors.text,
        fontSize: 16
    }
  });
  