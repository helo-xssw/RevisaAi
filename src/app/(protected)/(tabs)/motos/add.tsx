// src/app/(protected)/(tabs)/motos/add.tsx
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useMotos } from '@/hooks/useMotos';
import { borderRadius, colors, spacing, typography } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddMotoScreen() {
  const router = useRouter();
  const { addMoto } = useMotos();

  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [ano, setAno] = useState('');
  const [km, setKm] = useState('');
  const [dataDate, setDataDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{
    nome?: string;
    marca?: string;
    ano?: string;
    km?: string;
    data?: string;
  }>({});
  const [saving, setSaving] = useState(false);
  function handleChangeAno(text: string) {
    const onlyDigits = text.replace(/\D/g, '').slice(0, 4);
    setAno(onlyDigits);
  }

  function validar() {
    const e: typeof errors = {};
    if (!nome.trim()) e.nome = 'Informe o nome da moto';
    if (!marca.trim()) e.marca = 'Informe a marca/modelo';
    if (!ano.trim()) e.ano = 'Informe o ano';
    if (!km.trim()) e.km = 'Informe a quilometragem';

    const anoNumber = Number(ano);
    if (ano && (isNaN(anoNumber) || anoNumber < 1900)) {
      e.ano = 'Ano inválido';
    }

    const kmNumber = Number(km.replace(/\./g, '').replace(',', '.'));
    if (km && isNaN(kmNumber)) {
      e.km = 'KM inválido';
    }

    if (dataDate) {
      const today = new Date();
      today.setHours(0,0,0,0);
      const picked = new Date(dataDate);
      picked.setHours(0,0,0,0);
      if (picked < today) {
        e.data = 'Data deve ser igual ou futura.';
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function formatDatePtBr(d: Date) {
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
  }

  async function handleSalvar() {
    if (!validar()) return;
    setSaving(true);
    try {
      const anoNumber = Number(ano);
      const kmNumber = Number(km.replace(/\./g, '').replace(',', '.'));

      await addMoto({
        name: nome.trim(),
        brand: marca.trim(),
        year: anoNumber,
        km: kmNumber,
        nextRevisionDate: dataDate ? dataDate.toISOString() : undefined,
      });

      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a moto.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <TextInput
            label="Nome"
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Biz"
            error={errors.nome}
            autoCapitalize="words"
            returnKeyType="next"
          />
          <TextInput
            label="Marca"
            value={marca}
            onChangeText={setMarca}
            placeholder="Ex: Honda"
            error={errors.marca}
            autoCapitalize="words"
            returnKeyType="next"
          />
          <TextInput
            label="Ano"
            value={ano}
            onChangeText={handleChangeAno}
            placeholder="Ex: 2025"
            keyboardType="number-pad"
            error={errors.ano}
            returnKeyType="next"
            maxLength={4}
          />
          <TextInput
            label="Quilometragem"
            value={km}
            onChangeText={setKm}
            placeholder="Ex: 20.000"
            keyboardType="numeric"
            error={errors.km}
            returnKeyType="next"
          />
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Data (opcional)</Text>
            <TouchableOpacity
              style={[
                styles.dateField,
                errors.data && styles.dateFieldError,
              ]}
              onPress={() => setShowDatePicker(true)}
              accessibilityRole="button"
              accessibilityLabel="Selecionar data de próxima revisão"
            >
              <Text
                style={[
                  styles.dateFieldText,
                  !dataDate && styles.dateFieldPlaceholder,
                ]}
              >
                {dataDate ? formatDatePtBr(dataDate) : 'Selecionar data'}
              </Text>
              {dataDate && (
                <TouchableOpacity
                  onPress={() => setDataDate(null)}
                  accessibilityLabel="Limpar data"
                  style={styles.clearDateBtn}
                  hitSlop={8}
                >
                  <Ionicons name="close" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
              <Ionicons
                name="calendar"
                size={20}
                color={colors.textSecondary}
                style={styles.calendarIcon}
              />
            </TouchableOpacity>
            {errors.data && <Text style={styles.errorText}>{errors.data}</Text>}
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={dataDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={new Date()}
              onChange={(event: any, selectedDate?: Date) => {
                if (Platform.OS === 'android') {
                  setShowDatePicker(false);
                }
                if (selectedDate) {
                  setDataDate(selectedDate);
                } else if (event?.type === 'dismissed') {
                  setShowDatePicker(false);
                }
              }}
            />
          )}
          <Button
            onPress={handleSalvar}
            variant="primary"
            size="md"
            loading={saving}
            disabled={saving}
          >
            Salvar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.arimo,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  form: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  dateContainer: {
    marginBottom: spacing.md,
  },
  dateLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.arimo,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    backgroundColor: colors.background,
  },
  dateFieldError: {
    borderColor: colors.borderError,
  },
  dateFieldText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.inter,
    color: colors.textPrimary,
  },
  dateFieldPlaceholder: {
    color: colors.textSecondary,
  },
  clearDateBtn: {
    marginRight: spacing.sm,
  },
  calendarIcon: {
    marginLeft: spacing.xs,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.inter,
    color: colors.textError,
    marginTop: spacing.xs,
  },
});
