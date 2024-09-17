import HeaderProfile from "@/src/components/HeaderProfile";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { Button, ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user } = useAuthContext()

  return (
    <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
      <SafeAreaView style={globalStyles.pageContainer}>
        <View style={globalStyles.container}>
          <HeaderProfile name={user?.nome || "Error"} amountToRecive="1250,90" lastPayment={"09/08"}/>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({

});
