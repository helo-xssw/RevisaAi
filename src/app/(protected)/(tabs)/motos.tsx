import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { colors, spacing, typography } from '@/theme/colors';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MotosScreen() {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [errors, setErrors] = useState<{ marca?: string; modelo?: string; placa?: string }>({});

  function validar() {
    const e: typeof errors = {};
    if (!marca.trim()) e.marca = 'Informe a marca';
    if (!modelo.trim()) e.modelo = 'Informe o modelo';
    if (!placa.trim()) e.placa = 'Informe a placa';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSalvar() {
    if (!validar()) return;
    Alert.alert('Moto salva', `${marca} ${modelo} • ${placa}`);
    setMarca(''); setModelo(''); setPlaca('');
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} testID="screen-motos">
        <Text style={styles.title} accessibilityRole="header">Suas motos</Text>
        <Text style={styles.subtitle}>Cadastre e gerencie suas motocicletas.</Text>

        <View style={styles.form} accessible accessibilityLabel="Formulário de moto">
          <TextInput
            label="Marca"
            value={marca}
            onChangeText={setMarca}
            placeholder="Ex.: Honda"
            error={errors.marca}
            autoCapitalize="words"
            returnKeyType="next"
            testID="input-marca"
          />
          <TextInput
            label="Modelo"
            value={modelo}
            onChangeText={setModelo}
            placeholder="Ex.: CG 160"
            error={errors.modelo}
            autoCapitalize="characters"
            returnKeyType="next"
            testID="input-modelo"
          />
          <TextInput
            label="Placa"
            value={placa}
            onChangeText={setPlaca}
            placeholder="ABC-1D23"
            error={errors.placa}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={8}
            returnKeyType="done"
            testID="input-placa"
          />

          <Button onPress={handleSalvar} variant="primary" size="lg" fullWidth testID="btn-salvar">
            Salvar moto
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  title: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.md },
  form: { gap: spacing.md },
});
