import { borderRadius, colors, spacing, typography } from '@/theme/colors';
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
        <Text style={styles.title}>{name}</Text>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.text}>{endereco}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.text}>{telefone}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.text}>{horario}</Text>
        </View>

        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => Linking.openURL(mapsUrl)}
        >
          <Ionicons name="map-outline" size={18} color={colors.primary} />
          <Text style={styles.mapText}>Ver no Google Maps</Text>
        </TouchableOpacity>
      </View>

      {logo && (
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      )}
      {!logo && (
        <View style={[styles.logo, styles.logoPlaceholder]}>
          <Ionicons name="business-outline" size={32} color={colors.borderLight} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderColor: colors.borderLight,
    borderWidth: 1.3,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
    alignItems: 'flex-start',
  },

  info: {
    flex: 1,
    paddingRight: spacing.md,
  },

  title: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.arimo,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
    gap: 6,
  },

  text: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.inter,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * 1.4,
  },

  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
  },

  mapText: {
    marginLeft: 6,
    color: colors.primary,
    fontFamily: typography.fontFamily.arimo,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },

  logoPlaceholder: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
