import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/theme/colors';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificacoesScreen() {
  function handlePermissoes() {
    // aqui entraria a solicitação de permissões de push (expo-notifications), se for o caso
    console.log('solicitar permissões de notificação');
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} testID="screen-notificacoes">
        <Text style={styles.title} accessibilityRole="header">Notificações</Text>
        <Text style={styles.subtitle}>Veja avisos e lembretes importantes.</Text>

        {/* Empty state simples */}
        <View style={styles.empty} accessible accessibilityLabel="Sem notificações">
          <Text style={styles.emptyTitle}>Sem notificações por aqui</Text>
          <Text style={styles.emptyText}>Ative as permissões para receber lembretes de revisão e avisos.</Text>

          <Button onPress={handlePermissoes} variant="primary" size="md" fullWidth={false} testID="btn-permissoes">
            Ativar permissões
          </Button>
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
  empty: { borderWidth: 1, borderColor: colors.borderLight, borderRadius: 12, padding: spacing.lg, alignItems: 'center', gap: spacing.sm },
  emptyTitle: { color: colors.textPrimary, fontWeight: typography.fontWeight.semibold },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.sm },
});
