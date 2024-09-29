import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalStyles } from '@/styles/styles';
import { Input } from '../Input';
import { colors } from '@/styles/color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Button from '../Button';
import { DayType } from '@/src/types/types';

export type CardDayData = Partial<Omit<DayType, 'id_pessoa' | 'pessoa'>> & {
  id_pessoa: number;
  pessoa: string;
};

interface CardDayProps {
  dayData: CardDayData;
  onSubmit: (data: CardDayData) => void;
}

export default function CardDay({ dayData, onSubmit }: CardDayProps) {
  const { handleSubmit, setValue } = useForm<CardDayData>({
    defaultValues: dayData
  });

  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    dayData?.data_dia_producao ? new Date(dayData.data_dia_producao) : undefined
  );

  useEffect(() => {
    if (dayData) {
      if (dayData.data_dia_producao) {
        setValue("data_dia_producao", dayData.data_dia_producao);
        setSelectedDate(new Date(dayData.data_dia_producao));
        setMode("view")
      }
      else {
        setMode("create")
      }
      if (dayData.valor_dia) setValue("valor_dia", dayData.valor_dia);
      setValue("pessoa", dayData.pessoa);
      setValue("id_pessoa", dayData.id_pessoa);
    }
    return () => {
      setSelectedDate(undefined)
    }
  }, [dayData, setValue]);

  const handleDateChange = (event: any, date: Date | undefined) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
      const dateString = date.toISOString();
      setValue("data_dia_producao", dateString);
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.dayContainer}>
        <View style={styles.firstLine}>
          <Ionicons
            onPress={() => {
              if (mode === "edit") {
                setMode("view")
              }
              else {
                router.navigate("/");
              }
            }}
            name="arrow-back-outline"
            size={35}
            color={colors.primary}
          />

          {
            mode !== 'view' ?
              <TouchableOpacity
                style={styles.dataButton}
                onPress={() => setShowPicker(true)}
              >
                <Input
                  value={selectedDate ? selectedDate.toLocaleDateString() : "__/__/__"}
                  onChangeText={() => { }}
                  editable={false}
                />
              </TouchableOpacity>
              :
              <View style={styles.dataText}>
                <Text style={styles.textValue}>
                  {selectedDate ? selectedDate.toLocaleDateString() : "Data não disponível"}
                </Text>
              </View>
          }
          {
            mode !== "create"
            &&
            <Ionicons
              onPress={() => setMode("edit")}
              name={mode === "view" ? "create-outline" : "trash-outline"}
              size={35}
              color={mode === "view" ? colors.primary : colors.error}
            />
          }

        </View>

        {
          showPicker
          &&
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        }

        <View style={styles.secondLine}>
          <Text style={styles.textValue}>Total: R${dayData.valor_dia || '0,00'}</Text>
          <Text style={styles.textValue}>{dayData?.pessoa}</Text>
        </View>

        {
          mode !== 'view'
          &&
          <Button title={"Salvar"} onPress={handleSubmit(onSubmit)} />
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dayContainer: {
    padding: 8,
    gap: 32
  },
  firstLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataButton: {
    flexGrow: 1
  },
  dataText:{
    flex: 1,
    paddingLeft: 8,
    justifyContent: "flex-start",
  },
  secondLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textValue: {
    fontSize: 18,
    color: colors.text,
  }
});
