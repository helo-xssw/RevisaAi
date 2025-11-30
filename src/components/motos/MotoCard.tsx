// src/components/motos/MotoCard.tsx
import { Moto } from '@/api/motos';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
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
            style={styles.menuBtn}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Ano: {moto.year}</Text>
        <View style={styles.metaSeparator} />
        <Text style={styles.metaText}>
          KM: {moto.km.toLocaleString('pt-BR')}
        </Text>
      </View>
      <View style={styles.divider} />
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
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 20,
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1C',
    letterSpacing: 0.1,
  },
  menuBtn: {
    padding: 4,
    borderRadius: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  metaText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#6B6B6B',
    fontWeight: '400',
  },
  metaSeparator: {
    width: 1,
    height: 16,
    backgroundColor: '#E3E2E2',
    borderRadius: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E3E2E2',
    marginVertical: 12,
    borderRadius: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});
