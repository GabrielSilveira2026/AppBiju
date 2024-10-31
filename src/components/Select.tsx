import { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList, Dimensions, Alert, Pressable } from 'react-native';
import { Input } from './Input';
import { colors } from '@/styles/color';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type SelectProps = {
    list: any[],
    label: string,
    initialText?: string,
    onSelect: (item: any) => void
}

export default function Select({ initialText, list, label, onSelect }: SelectProps) {
    const [showModal, setShowModal] = useState(false);
    const [filteredData, setFilteredData] = useState(list);
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState(initialText ? { [label]: initialText } : null);

    useEffect(() => {
        setFilteredData(list);
    }, [list]);

    function handleSearch(text: string) {
        setSearch(text);
        setFilteredData(
            list.filter(item =>
                item.nome.toLowerCase().includes(text.toLowerCase())
            )
        );
    };

    function handleSelect(item: any) {
        setSelectedItem(item);
        onSelect(item);
        setShowModal(false);
    }

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => setShowModal(true)} style={styles.button}>
                <Text
                    style={[styles.textButton, { color: selectedItem ? colors.text : colors.textInput }]}>
                    {selectedItem ? selectedItem[label] : 'Selecione um produto'}
                </Text>
                <Ionicons name={showModal ? 'chevron-up-outline' : 'chevron-down-outline'} color={colors.primary} size={30} />
            </TouchableOpacity>
            {showModal && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showModal}
                    onRequestClose={() => {
                        setShowModal(!showModal);
                    }}>
                    <Pressable onPress={() => setShowModal(!showModal)} style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Input
                                inputStyle={{ width: "100%" }}
                                placeholder="Pesquise um produto"
                                value={search}
                                onChangeText={handleSearch}
                            />
                            <FlatList
                                data={filteredData}
                                keyboardShouldPersistTaps='handled'
                                keyExtractor={(item) => item.id_produto}
                                style={{ width: "100%" }}
                                contentContainerStyle={{ gap: 8 }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => handleSelect(item)}
                                        style={styles.item}
                                    >
                                        <Text style={styles.label}>{item[label]}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </Pressable>
                </Modal>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    },
    modalView: {
        margin: 20,
        backgroundColor: colors.backgroundTertiary,
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        width: "100%",
        height: "60%",
        gap: 16
    },
    button: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: colors.backgroundInput,
        borderBottomColor: colors.text,
        borderBottomWidth: 1,
        borderRadius: 4
    },
    textButton: {
        flex: 1,
        fontSize: 16
    },
    item: {
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderRadius: 4,
        backgroundColor: colors.backgroundInput,
    },
    label: {
        flex: 1,
        textAlign: "center",
        color: "white"
    }
});