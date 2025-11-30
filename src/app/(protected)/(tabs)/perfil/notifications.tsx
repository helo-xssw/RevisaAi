import { Button } from '@/components/ui/Button';
import { borderRadius, colors, spacing, typography } from '@/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSalvar() {
    setSaving(true);
    try {
      setTimeout(() => { setSaving(false); router.back(); }, 500);
    } catch (error) {
      setSaving(false);
    }
  }
  function handleCancelar() { router.back(); }

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} accessibilityRole="header">Gerenciar Notificações</Text>
        <View style={styles.card}>
          <SettingToggleRow label="Som da notificação" value={soundEnabled} onValueChange={setSoundEnabled} />
          <View style={styles.divider} />
          <SettingToggleRow label="Notificação push" value={pushEnabled} onValueChange={setPushEnabled} />
          <View style={styles.divider} />
          <SettingToggleRow label="Vibração" value={vibrationEnabled} onValueChange={setVibrationEnabled} />
        </View>
        <View style={styles.actions}>
          <Button variant="primary" size="lg" fullWidth onPress={handleSalvar} loading={saving} disabled={saving}>Salvar</Button>
          <Button variant="secondary" size="md" fullWidth onPress={handleCancelar} disabled={saving}>Cancelar</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type SettingToggleRowProps = { label: string; value: boolean; onValueChange: (value: boolean) => void };
function SettingToggleRow({ label, value, onValueChange }: SettingToggleRowProps) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.borderLight, true: colors.primaryDisabled }}
        thumbColor={value ? colors.primary : colors.background}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  title: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, fontFamily: typography.fontFamily.arimo, color: colors.textPrimary, marginBottom: spacing.lg },
  card: { borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.borderLight, backgroundColor: colors.background, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginBottom: spacing.lg },
  divider: { height: 1, backgroundColor: colors.borderLight },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm },
  toggleLabel: { fontFamily: typography.fontFamily.inter, fontSize: typography.fontSize.md, color: colors.textPrimary },
  actions: { gap: spacing.sm },
});
