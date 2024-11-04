import { Input } from '@/src/components/Input'
import CardPayment from '@/src/components/Payment/CardPayment'
import { colors } from '@/styles/color'
import { IMAGE_PATHS } from '@/styles/constants'
import { globalStyles } from '@/styles/styles'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { View, Text, ImageBackground, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
export default function Payment() {
  return (
    <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
      <SafeAreaView style={globalStyles.pageContainer}>
        <View style={[globalStyles.container, styles.paymentContainer]}>
          <View style={styles.titleContainer}>
            <Ionicons
              onPress={() => {
                router.navigate("/");
              }}
              name="arrow-back-outline"
              size={35}
              color={colors.primary}
            />
            <Text style={globalStyles.title}>Pagamentos</Text>
            <Input
              value=""
              placeholder="Pesquisar"
              onChangeText={() => { }}
            />
          </View>
          <CardPayment/>
          <CardPayment/>
          <CardPayment/>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  paymentContainer: {
    flex: 1,
    flexGrow: 1,
  },
  titleContainer: {
    padding: 8,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
})