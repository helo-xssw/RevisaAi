import { Revision } from '@/api/revisions';
import { useMotos } from '@/hooks/useMotos';
import { useNotifications } from '@/hooks/useNotifications';
import { useRevisions } from '@/hooks/useRevisions';
import { borderRadius, colors, spacing, typography } from '@/theme/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MotoRevisionsScreen() {
  const router = useRouter();
  const { motoId } = useLocalSearchParams<{ motoId?: string }>();
  const { motos } = useMotos();
  const {
    revisions,
    loading,
    setStatus,
  } = useRevisions();
  const { updateStatusByRevisionId } = useNotifications();

  const [activeTab, setActiveTab] =
    useState<'pending' | 'done'>('pending');

  const moto = useMemo(
    () => motos.find((m) => m.id === motoId),
    [motos, motoId],
  );

  const filteredRevisions = useMemo(
    () =>
      revisions.filter(
        (rev: Revision) =>
          rev.motoId === motoId && rev.status === activeTab,
      ),
    [revisions, motoId, activeTab],
  );

  function handleMarkAsDone(revision: Revision) {
    if (revision.status === 'done') return;

    Alert.alert('Deseja marcar como concluída?', '', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: async () => {
          await setStatus(revision.id, 'done');
          await updateStatusByRevisionId(revision.id, 'done');
        },
      },
    ]);
  }

  function handleEdit(revision: Revision) {
    router.push({
      pathname: '/(protected)/(tabs)/motos/revision-form',
      params: {
        mode: 'edit',
        revisionId: revision.id,
        motoId: revision.motoId,
      },
    });
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.content}>
        {moto && (
          <Text style={styles.subtitle}>
            {moto.name} • {moto.brand}
          </Text>
        )}

        <View style={styles.tabsContainer}>
          <TabButton
            label="Revisões Pendentes"
            active={activeTab === 'pending'}
            onPress={() => setActiveTab('pending')}
          />
          <TabButton
            label="Revisões Antigas"
            active={activeTab === 'done'}
            onPress={() => setActiveTab('done')}
          />
        </View>

        {loading && (
          <Text style={styles.loadingText}>
            Carregando revisões...
          </Text>
        )}

        <FlatList
          data={filteredRevisions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => (
            <View style={{ height: spacing.md }} />
          )}
          renderItem={({ item }) => (
            <RevisionCard
              revision={item}
              isDone={item.status === 'done'}
              onEdit={() => handleEdit(item)}
              onMarkDone={() => handleMarkAsDone(item)}
            />
          )}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>
                  Nenhuma revisão nesta aba
                </Text>
                <Text style={styles.emptyText}>
                  Você verá aqui as revisões{' '}
                  {activeTab === 'pending'
                    ? 'pendentes da sua moto.'
                    : 'já concluídas.'}
                </Text>
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

type TabButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function TabButton({ label, active, onPress }: TabButtonProps) {
  return (
    <Text
      onPress={onPress}
      style={[
        styles.tabButton,
        active ? styles.tabButtonActive : styles.tabButtonInactive,
      ]}
    >
      {label}
    </Text>
  );
}

type RevisionCardProps = {
  revision: Revision;
  isDone: boolean;
  onEdit: () => void;
  onMarkDone: () => void;
};

function RevisionCard({
  revision,
  isDone,
  onEdit,
  onMarkDone,
}: RevisionCardProps) {
  // Formatar data e hora a partir do ISO
  const formattedDate = new Date(revision.date).toLocaleDateString('pt-BR');
  const formattedTime = new Date(revision.time).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.card}>
      {/* Título */}
      <Text style={styles.cardTitle}>{revision.title}</Text>

      {/* Serviço (subtítulo) */}
      <Text style={styles.cardService}>{revision.service}</Text>

      {/* Linha divisória */}
      <View style={styles.divider} />

      {/* Data e Hora */}
      <View style={styles.dateTimeRow}>
        <Text style={styles.dateTimeText}>
          Data: {formattedDate}
        </Text>
        <Text style={styles.dateTimeText}>
          Hora: {formattedTime}
        </Text>
      </View>

      {/* Observações */}
      {revision.details && (
        <Text style={styles.obsText}>
          Obs: {revision.details}
        </Text>
      )}

      {/* Botões de ação */}
      {!isDone ? (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={onMarkDone}>
            <Text style={styles.primaryButtonText}>Marcar como Concluída</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionsRow}>
          <View style={styles.doneBadgeContainer}>
            <Text style={styles.doneBadgeText}>Concluída ✓</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const CARD_BORDER = 1.3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.md },
  subtitle: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tabButton: {
    flex: 1,
    textAlign: 'center',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    fontFamily: typography.fontFamily.arimo,
    fontSize: typography.fontSize.sm,
  },
  tabButtonActive: {
    backgroundColor: colors.textPrimary,
    color: colors.textWhite,
  },
  tabButtonInactive: {
    backgroundColor: colors.background,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  loadingText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: colors.textError,
    marginBottom: spacing.sm,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontFamily: typography.fontFamily.inter,
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: spacing.xs,
  },
  cardService: {
    fontFamily: typography.fontFamily.inter,
    fontSize: 15,
    fontWeight: '400',
    color: '#000000',
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginVertical: spacing.sm,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  dateTimeText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  obsText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(37,35,35,0.81)',
    marginBottom: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  editButton: {
    width: 114,
    height: 42,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  editButtonText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  primaryButton: {
    flex: 1,
    height: 42,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textWhite,
  },
  doneBadge: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: '#16A34A',
    fontWeight: '600',
  },
  doneBadgeContainer: {
    flex: 1,
    height: 42,
    backgroundColor: '#16A34A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneBadgeText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textWhite,
  },
  emptyState: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.arimo,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
