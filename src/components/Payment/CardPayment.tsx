import { constants } from '@/src/constants/constants';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { colors } from '@/styles/color';
import { globalStyles } from '@/styles/styles';
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native'


export default function CardPayment() {
    const { user } = useAuthContext()
    const [modeCard, setModeCard] = useState<"view" | "create">("view");

    if (modeCard === "view") {
        return (
            <Pressable style={[globalStyles.cardContainer, stylesView.cardContainer]}>
                <View style={styles.line}>
                    <View style={stylesView.textContainer}>
                        <Text style={styles.textValue}>09/11/24</Text>
                    </View>
                    {
                        user?.id_perfil === constants.perfil.funcionario.id_perfil &&
                        <View style={stylesView.textContainer}>
                            <Text style={styles.textValue}>Gabriel Silveira</Text>
                        </View>
                    }
                    <View style={stylesView.textContainer}>
                        <Text style={styles.textValue}>R$ 3000,00</Text>
                    </View>
                </View>
            </Pressable>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        padding: 8,
        backgroundColor: colors.backgroundTertiary
    },
    line: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
    },
    textValue: {
        fontSize: 16,
        color: colors.text,
        textAlign: "center"
    },
    buttonOpen: {
        padding: 8
    },
    cardOpenedDetails: {
        padding: 8,
        gap: 8
    },
    valueVertical: {
        padding: 8,
        gap: 8,
        alignItems: "center",
    },
    titleText: {
        fontSize: 16,
        color: colors.text,
        textAlign: "center"
    },
    inputValue: {
        fontSize: 16,
        padding: 8,
        color: colors.text,
    },
    buttonsContainer: {
        flexDirection: "row",
        gap: 8,
    },
    dataContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    dataValue: {
        padding: 12,
        backgroundColor: colors.backgroundInput,
        borderBottomColor: colors.text,
        borderBottomWidth: 1,
        borderRadius: 4,
        alignItems: "center",
    },
    dataText: {
        fontSize: 16,
        color: colors.text,
    },
})

const stylesView = StyleSheet.create({
    cardContainer: {
        borderBottomWidth: 1,
        borderBottomColor: colors.text
    },
    nameAndCode: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "space-between"
    },
    textContainer: {
        paddingVertical: 8,
        flex: 1,
    },
    iconsLine: {
        paddingHorizontal: 8
    }
})