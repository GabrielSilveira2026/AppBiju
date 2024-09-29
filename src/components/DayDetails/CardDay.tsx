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
  mode: 'view' | 'edit' | 'create';
  dayData: CardDayData;
  onSubmit: (data: CardDayData) => void;
}

export default function CardDay({ mode, dayData, onSubmit }: CardDayProps) {
  const { control, handleSubmit, watch, setValue } = useForm<CardDayData>({
    defaultValues: dayData
  });

  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    dayData?.data_dia_producao ? new Date(dayData.data_dia_producao) : undefined
  );

  useEffect(() => {
    if (dayData) {
      if (dayData.data_dia_producao) {
        setValue("data_dia_producao", dayData.data_dia_producao);
        setSelectedDate(new Date(dayData.data_dia_producao));
      }
      if (dayData.valor_dia) setValue("valor_dia", dayData.valor_dia);
      setValue("pessoa", dayData.pessoa);
      setValue("id_pessoa", dayData.id_pessoa);
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
              router.navigate("/");
            }}
            name="arrow-back-outline"
            size={35}
            color={colors.primary}
          />

          {mode !== 'view' ? (
            <TouchableOpacity
              style={styles.dataButton}
              onPress={() => setShowPicker(true)}
            >
              <Input
                value={selectedDate ? selectedDate.toLocaleDateString() : ""}
                onChangeText={() => { }}
                placeholder="__/__/__"
                editable={false}
              />
            </TouchableOpacity>
          ) : (
            <Text>{selectedDate ? selectedDate.toLocaleDateString() : "Data não disponível"}</Text>
          )}
        </View>

        {showPicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <View style={styles.secondLine}>
          <Text style={styles.textValue}>Total: R${dayData.valor_dia || '0,00'}</Text>
          <Text style={styles.textValue}>{dayData.pessoa}</Text>
        </View>

        {mode !== 'view' && (
          <Button title="Enviar" onPress={handleSubmit(onSubmit)} />
        )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataButton: {
    flexGrow: 1
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
