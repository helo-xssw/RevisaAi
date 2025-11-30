// src/components/motos/MotoCard.tsx
import { Moto } from '@/api/motos';
import { Button } from '@/components/ui/Button';
import { borderRadius, colors, spacing, typography } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type MotoCardProps = {
  moto: Moto;
  onPressViewRevisions: (moto: Moto) => void;
  onPressAddRevision: (moto: Moto) => void;
  onPressDelete?: (moto: Moto) => void;
};

export function MotoCard({
  moto,
  onPressViewRevisions,
  onPressAddRevision,
  onPressDelete,
}: MotoCardProps) {
  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={`Moto ${moto.name} - ${moto.brand}`}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {moto.name} - {moto.brand}
          </Text>
        </View>

        {onPressDelete && (
          <TouchableOpacity
            onPress={() => onPressDelete(moto)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Mais opções da moto"
          >
            <Ionicons
              name="ellipsis-vertical"
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.meta}>
        <Text style={styles.metaText}>Ano: {moto.year}</Text>
        <Text style={styles.metaText}>
          KM: {moto.km.toLocaleString('pt-BR')}
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          variant="secondary"
          size="md"
          fullWidth={false}
          onPress={() => onPressViewRevisions(moto)}
        >
          Ver Revisões
        </Button>
        <Button
          variant="primary"
          size="md"
          fullWidth={false}
          onPress={() => onPressAddRevision(moto)}
        >
          + Revisão
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: typography.fontFamily.arimo,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  meta: {
    marginBottom: spacing.md,
  },
  metaText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
});
