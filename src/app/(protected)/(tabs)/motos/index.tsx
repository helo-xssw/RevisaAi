// src/app/(protected)/(tabs)/motos/index.tsx
import { Moto } from '@/api/motos';
import { MotoCard } from '@/components/motos/MotoCard';
import { useMotos } from '@/hooks/useMotos';
import { colors, spacing, typography } from '@/theme/colors';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FAB_SIZE = 56;

export default function MotosListScreen() {
  const router = useRouter();
  const { motos, loading, error, remove } = useMotos();

  function handleDeleteMoto(moto: Moto) {
    Alert.alert(
      'Deseja excluir a moto?',
      'Excluir a moto irá remover permanentemente todos os dados e revisões associadas.',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => remove(moto.id),
        },
      ],
    );
  }

  function handleViewRevisions(moto: Moto) {
    router.push({
      pathname: '/(protected)/(tabs)/motos/revisions',
      params: { motoId: moto.id },
    });
  }

  function handleAddRevision(moto: Moto) {
    router.push({
      pathname: '/(protected)/(tabs)/motos/revision-form',
      params: { mode: 'create', motoId: moto.id },
    });
  }

  const isEmpty = useMemo(
    () => !loading && motos.length === 0,
    [loading, motos],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        testID="screen-motos"
        data={motos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerTitleWrap}>

            <Text style={styles.subtitle}>
              Gerencie suas motos e revisões.
            </Text>

            {loading && (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.loadingText}>Carregando motos...</Text>
              </View>
            )}
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            {!isEmpty && !loading && (
              <Text style={styles.sectionTitle}>Motos cadastradas</Text>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nenhuma moto cadastrada</Text>
              <Text style={styles.emptyText}>
                Toque no botão vermelho para adicionar sua primeira moto.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <MotoCard
            moto={item}
            onPressViewRevisions={handleViewRevisions}
            onPressAddRevision={handleAddRevision}
            onPressDelete={handleDeleteMoto}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB abre tela "Adicionar Moto" */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        <View
          style={styles.fab}
          accessibilityRole="button"
          accessibilityLabel="Adicionar moto"
          onTouchEnd={() =>
            router.push('/(protected)/(tabs)/motos/add')
          }
        >
          {/* Ícone será inserido aqui futuramente */}
          <Text style={styles.fabText}>+</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: {
    padding: spacing.md,
    paddingBottom: FAB_SIZE + spacing.lg,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerImage: {
    width: 140,
    height: 80,
    resizeMode: 'contain',
    flexShrink: 0,
    marginLeft: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.arimo,
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.md,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  loadingText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  errorText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: colors.textError,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.arimo,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.arimo,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
  },
});

