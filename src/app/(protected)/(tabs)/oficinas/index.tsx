import { Oficina, OficinaCard } from '@/components/OficinaCard';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { colors, spacing, typography } from '@/theme/colors';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OFICINAS: Oficina[] = [
  {
    name: 'HC Moto Peças',
    endereco: 'R. Issac Péres, 554-656 - Centro, Itacoatiara - AM',
    telefone: '(92) 99236-7244',
    horario: 'Seg–Sáb: 08:00–18:30 • Dom: Fechado',
    mapsUrl: 'https://maps.app.goo.gl/i27xCZHWRyGABcoM9?g_st=ipc',
    logo: require('@/assets/images/oficinas/HC-Moto-pecas.jpg'),
  },
  {
    name: 'Moto Tintas Ila',
    endereco: 'Av. Conselheiro Ruy Barbosa, 490 - Centro, Itacoatiara - AM',
    telefone: '(92) 99154-9435',
    horario: 'Seg–Sáb: 07:30–18:00 • Dom: Fechado',
    mapsUrl: 'https://maps.app.goo.gl/H5H9qgDERaVQdzdP6?g_st=ipc',
    logo: require('@/assets/images/oficinas/moto-tintas-ila.jpg'),
  },
  {
    name: 'Nil Motos I',
    endereco: 'Av. Manaus, 1151 - Centro, Itacoatiara - AM',
    telefone: '(92) 99162-8363',
    horario: 'Seg–Sáb: 07:30–18:00 • Dom: Fechado',
    mapsUrl: 'https://maps.app.goo.gl/emr2uwkYsJ7LL7RR8?g_st=ipc',
    logo: require('@/assets/images/oficinas/nil-motos-logo.jpg'),
  },
  {
    name: 'Nil Motos II',
    endereco: 'Av. Mário Andreazza, 2716 - São Cristóvão, Itacoatiara - AM',
    telefone: '(92) 99422-7346',
    horario: 'Seg–Sáb: 07:30–18:00 • Dom: Fechado',
    mapsUrl: 'https://maps.app.goo.gl/Xtrmw3gKLh8Qdh7F6?g_st=ipc',
    logo: require('@/assets/images/oficinas/nil-motos-logo.jpg'),
  },
];

export default function OficinasScreen() {
  const [query, setQuery] = useState('');
  const [filteredOficinas, setFilteredOficinas] = useState(OFICINAS);

  function handleBuscar() {
    if (!query.trim()) {
      setFilteredOficinas(OFICINAS);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const filtered = OFICINAS.filter((oficina) => {
      return (
        oficina.name.toLowerCase().includes(searchTerm) ||
        oficina.endereco.toLowerCase().includes(searchTerm) ||
        oficina.telefone.includes(searchTerm)
      );
    });

    setFilteredOficinas(filtered);
  }

  function handleClearSearch() {
    setQuery('');
    setFilteredOficinas(OFICINAS);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} testID="screen-oficinas">
        <Text style={styles.subtitle}>Encontre e favorite oficinas próximas.</Text>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <TextInput
              label="Buscar"
              value={query}
              onChangeText={setQuery}
              placeholder="Nome, endereço ou telefone..."
              returnKeyType="search"
              onSubmitEditing={handleBuscar}
              testID="input-busca-oficinas"
            />
          </View>
          <View style={{ width: spacing.sm }} />
          <View style={styles.buttonGroup}>
            <Button 
              onPress={handleBuscar} 
              variant="primary" 
              size="md" 
              fullWidth={false} 
              testID="btn-buscar"
            >
              Buscar
            </Button>
            {query.length > 0 && (
              <Button 
                onPress={handleClearSearch} 
                variant="secondary" 
                size="md" 
                fullWidth={false}
                testID="btn-limpar"
              >
                Limpar
              </Button>
            )}
          </View>
        </View>

        {filteredOficinas.length === 0 && query.trim() !== '' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Nenhuma oficina encontrada para "{query}"
            </Text>
          </View>
        )}

        {filteredOficinas.map((item, index) => (
          <OficinaCard key={index} {...item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  title: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary },
  subtitle: { 
    color: colors.textSecondary, 
    marginTop: spacing.xs, 
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.inter,
  },
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: spacing.sm },
  buttonGroup: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  emptyState: {
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.inter,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
