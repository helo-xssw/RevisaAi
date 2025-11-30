import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { colors, spacing, typography } from '@/theme/colors';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OficinasScreen() {
  const [query, setQuery] = useState('');

  function handleBuscar() {
    console.log('buscando oficinas por:', query);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} testID="screen-oficinas">
        <Text style={styles.title} accessibilityRole="header">Oficinas</Text>
        <Text style={styles.subtitle}>Encontre e favorite oficinas próximas.</Text>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <TextInput
              label="Buscar"
              value={query}
              onChangeText={setQuery}
              placeholder="Bairro, serviço, nome..."
              returnKeyType="search"
              onSubmitEditing={handleBuscar}
              testID="input-busca-oficinas"
            />
          </View>
          <View style={{ width: spacing.md }} />
          <View style={{ alignSelf: 'flex-end' }}>
            <Button onPress={handleBuscar} variant="secondary" size="md" fullWidth={false} testID="btn-buscar">
              Buscar
            </Button>
          </View>
        </View>

        <View style={styles.card} accessible accessibilityLabel="Oficina exemplo">
          <Text style={styles.cardTitle}>Oficina Exemplo</Text>
          <Text style={styles.cardText}>Rua da Manutenção, 123 — Centro</Text>
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
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  card: { backgroundColor: colors.background, borderColor: colors.borderLight, borderWidth: 1, borderRadius: 12, padding: spacing.md, marginTop: spacing.md },
  cardTitle: { fontWeight: typography.fontWeight.semibold, color: colors.textPrimary, fontSize: typography.fontSize.md },
  cardText: { color: colors.textSecondary, marginTop: spacing.xs },
});
