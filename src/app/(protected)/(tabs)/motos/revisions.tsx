import { Button } from '@/components/ui/Button';
import { useMotos } from '@/hooks/useMotos';
import { borderRadius, colors, spacing, typography } from '@/theme/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RevisionStatus = 'pending' | 'done';

type Revision = {
  id: string;
  motoId: string;
  title: string;
  description: string;
  details: string;
  date: string;
  time: string;
  km?: number;
  status: RevisionStatus;
};

const MOCK_REVISIONS: Revision[] = [
  {
    id: '1',
    motoId: '1',
    title: 'Troca de Óleo',
    description: 'Óleo do motor',
    details: 'Moto está com problema de carburador...',
    date: '18/11/2026',
    time: '10:00',
    status: 'pending',
  },
  {
    id: '2',
    motoId: '1',
    title: 'Revisão Geral',
    description: 'Motor, faróis e freio',
    details: 'Realizar revisão geral para venda da moto...',
    date: '05/12/2026',
    time: '10:00',
    status: 'pending',
  },
  {
    id: '3',
    motoId: '1',
    title: 'Troca de Kit',
    description: 'Corrente, coroa e pinhão',
    details:
      'Folga excessiva na corrente e dentes da coroa/pinhão irregulares. Recomendada substituição do kit relação para evitar rupturas.',
    date: '22/10/2025',
    time: '10:00',
    km: 15650,
    status: 'done',
  },
];

export default function MotoRevisionsScreen() {
  const router = useRouter();
  const { motoId } = useLocalSearchParams<{ motoId?: string }>();
  const { motos } = useMotos();
  const [revisions, setRevisions] = useState<Revision[]>(MOCK_REVISIONS);
  const [activeTab, setActiveTab] = useState<RevisionStatus>('pending');

  const moto = useMemo(
    () => motos.find((m) => m.id === motoId),
    [motos, motoId],
  );

  const filteredRevisions = useMemo(
    () =>
      revisions.filter(
        (rev) => rev.motoId === motoId && rev.status === activeTab,
      ),
    [revisions, motoId, activeTab],
  );

  function handleMarkAsDone(revision: Revision) {
    Alert.alert(
      'Deseja marcar como concluída?',
      '',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => {
            setRevisions((prev) =>
              prev.map((rev) =>
                rev.id === revision.id
                  ? { ...rev, status: 'done' }
                  : rev,
              ),
            );
            setActiveTab('pending'); // opcional: manter na aba Pendente
          },
        },
      ],
    );
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
        {/* header do Stack já cuida do título; aqui podemos mostrar moto */}
        {moto && (
          <Text style={styles.subtitle}>
            {moto.name} • {moto.brand}
          </Text>
        )}

        {/* Tabs */}
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
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>{revision.title}</Text>
        {isDone && (
          <Text style={styles.doneBadge}>
            Concluída ✓
          </Text>
        )}
      </View>

      <Text style={styles.cardBullet}>• {revision.description}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          {isDone ? 'Feita em:' : 'Data:'} {revision.date}
        </Text>
        <Text style={styles.infoText}>Hora: {revision.time}</Text>
      </View>

      {revision.km != null && (
        <Text style={styles.infoText}>
          KM: {revision.km.toLocaleString('pt-BR')}
        </Text>
      )}

      <View style={styles.obsRow}>
        <Text style={styles.obsLabel}>Obs:</Text>
        <Text style={styles.obsText}>{revision.details}</Text>
      </View>

      {!isDone && (
        <View style={styles.actionsRow}>
          <Button
            variant="secondary"
            size="md"
            fullWidth={false}
            onPress={onEdit}
          >
            Editar
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth={false}
            onPress={onMarkDone}
          >
            Marcar como Concluída
          </Button>
        </View>
      )}
    </View>
  );
}

const CARD_BORDER = 1.3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
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
  card: {
    borderRadius: borderRadius.md,
    borderWidth: CARD_BORDER,
    borderColor: colors.borderLight,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontFamily: typography.fontFamily.arimo,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  doneBadge: {
    fontFamily: typography.fontFamily.arimo,
    fontSize: typography.fontSize.sm,
    color: '#16A34A', // verde
    fontWeight: typography.fontWeight.semibold,
  },
  cardBullet: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  infoText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  obsRow: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  obsLabel: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  obsText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.sm,
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
