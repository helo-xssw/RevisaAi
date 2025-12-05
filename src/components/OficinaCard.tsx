import { colors, spacing, typography } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type Oficina = {
  name: string;
  endereco: string;
  telefone: string;
  horario: string;
  mapsUrl: string;
  logo?: any; // require(...) opcional
};

export function OficinaCard({ name, endereco, telefone, horario, mapsUrl, logo }: Oficina) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        {/* Título */}
        <Text style={styles.title}>{name}</Text>

        {/* Linha divisória */}
        <View style={styles.divider} />

        {/* Detalhes */}
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={colors.textPrimary} />
          <Text style={styles.text}>{endereco}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={16} color={colors.textPrimary} />
          <Text style={styles.text}>{telefone}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={colors.textPrimary} />
          <Text style={styles.text}>{horario}</Text>
        </View>

        {/* Botão Maps */}
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => Linking.openURL(mapsUrl)}
        >
          <Ionicons name="map-outline" size={18} color={colors.textWhite} />
          <Text style={styles.mapText}>Ver no Google Maps</Text>
        </TouchableOpacity>
      </View>

      {logo && (
        <Image source={logo} style={styles.logo} resizeMode="cover" />
      )}
      {!logo && (
        <View style={[styles.logo, styles.logoPlaceholder]}>
          <Ionicons name="business-outline" size={32} color={colors.border} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.md,
    alignItems: 'flex-start',
  },

  info: {
    flex: 1,
    paddingRight: spacing.md,
  },

  title: {
    fontSize: 20,
    fontFamily: typography.fontFamily.inter,
    fontWeight: '600',
    color: '#000000',
    marginBottom: spacing.xs,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginVertical: spacing.sm,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    gap: 8,
  },

  text: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.fontFamily.inter,
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: 20,
  },

  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    height: 42,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },

  mapText: {
    marginLeft: 8,
    color: colors.textWhite,
    fontFamily: typography.fontFamily.inter,
    fontWeight: '600',
    fontSize: 16,
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.background,
  },

  logoPlaceholder: {
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
