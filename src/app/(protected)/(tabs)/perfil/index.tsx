import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PerfilScreen() {
  const router = useRouter();
  const auth = useAuth() as any;
  const user = auth.user ?? { name: 'Ricardo Pereira', email: 'ricardop@gmail.com' };

  function handleEditarPerfil() {
    (router as any).push('/(protected)/(tabs)/perfil/edit');
  }
  function handleGerenciarNotificacoes() {
    (router as any).push('/(protected)/(tabs)/perfil/notifications');
  }
  function handleSair() {
    if (auth.signOut) {
      auth.signOut();
    } else {
      Alert.alert('Sair', 'Função de sair ainda não implementada no AuthContext.');
    }
  }
  function handleDeletarConta() {
    Alert.alert(
      'Deseja excluir conta?',
      'Excluir a conta irá remover permanentemente todos os seus dados.',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: async () => {
            try {
              if (auth.deleteAccount) {
                await auth.deleteAccount();
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Erro', 'Não foi possível excluir a conta.');
            }
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      <View style={styles.content}>
        <Text style={styles.title} accessibilityRole="header">Perfil</Text>
        <View style={styles.profileCard} accessible accessibilityLabel="Informações de perfil">
          <View style={styles.profileRow}>
            <Image
              source={{ uri: user.avatarUrl ?? 'https://i.pravatar.cc/150?img=12' }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1}>{user.name}</Text>
              <Text style={styles.profileEmail} numberOfLines={1}>{user.email}</Text>
            </View>
          </View>
          <Button variant="secondary" size="md" fullWidth onPress={handleEditarPerfil}>Editar Perfil</Button>
        </View>

        <Text style={styles.sectionTitle}>Configurações</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7} onPress={handleGerenciarNotificacoes}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
              <Text style={styles.settingText}>Gerenciar Notificações</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle-outline" size={20} color={colors.textPrimary} />
              <Text style={styles.settingText}>Versão 1.0.0</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7} onPress={handleSair}>
            <View style={styles.settingLeft}>
              <Ionicons name="log-out-outline" size={20} color={colors.textPrimary} />
              <Text style={styles.settingText}>Sair</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7} onPress={handleDeletarConta}>
            <View style={styles.settingLeft}>
              <Ionicons name="trash-outline" size={20} color={colors.textError} />
              <Text style={[styles.settingText, styles.settingTextDanger]}>Deletar Conta</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.arimo,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.md },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.backgroundDisabled },
  profileInfo: { flex: 1 },
  profileName: { 
    fontFamily: typography.fontFamily.inter, 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#000000',
  },
  profileEmail: { 
    fontFamily: typography.fontFamily.inter, 
    fontSize: 15, 
    fontWeight: '400',
    color: colors.textPrimary, 
    marginTop: spacing.xs,
  },
  sectionTitle: { 
    fontFamily: typography.fontFamily.inter, 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#000000', 
    marginBottom: spacing.sm,
  },
  settingsCard: { 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: colors.border, 
    backgroundColor: colors.background, 
    paddingHorizontal: spacing.md, 
    paddingVertical: spacing.sm, 
    gap: spacing.xs,
  },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  settingText: { fontFamily: typography.fontFamily.inter, fontSize: 16, fontWeight: '500', color: colors.textPrimary },
  settingTextDanger: { color: colors.textError },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
});
