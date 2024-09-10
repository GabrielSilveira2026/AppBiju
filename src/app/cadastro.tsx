import { router } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import Button from '../components/Button'

export default function cadastro() {
  return (
    <View>
      <Text>cadastro</Text>
      <Button title={"Voltar"} onPress={()=>router.back()}/>
    </View>
  )
}
const styles = StyleSheet.create({})