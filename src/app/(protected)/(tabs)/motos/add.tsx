// src/app/(protected)/(tabs)/motos/add.tsx
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useMotos } from '@/hooks/useMotos';
import { borderRadius, colors, spacing, typography } from '@/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddMotoScreen() {
  const router = useRouter();
  const { addMoto } = useMotos();

  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [ano, setAno] = useState('');
  const [km, setKm] = useState('');
  const [data, setData] = useState(''); // string simples por enquanto
  const [errors, setErrors] = useState<{
    nome?: string;
    marca?: string;
    ano?: string;
    km?: string;
  }>({});
  const [saving, setSaving] = useState(false);

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

    setErrors(e);
    return Object.keys(e).length === 0;
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
        nextRevisionDate: data || undefined,
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
            onChangeText={setAno}
            placeholder="Ex: 2016"
            keyboardType="number-pad"
            error={errors.ano}
            returnKeyType="next"
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
          <TextInput
            label="Data (opcional)"
            value={data}
            onChangeText={setData}
            placeholder="Ex: 24 de maio de 2026"
            returnKeyType="done"
          />

          <Button
            onPress={handleSalvar}
            variant="primary"
            size="lg"
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
    fontSize: typography.fontSize.lg,
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
});
