import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useAuth } from '@/hooks/useAuth';
import { borderRadius, colors, spacing, typography } from '@/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditPerfilScreen() {
  const router = useRouter();
  const auth = useAuth() as any;
  const user = auth.user ?? { name: 'Ricardo Pereira', email: 'ricardop@gmail.com' };
  const [nome, setNome] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saving, setSaving] = useState(false);

  async function handleSalvar() {
    setSaving(true);
    try {
      if (auth.updateProfile) {
        await auth.updateProfile({ name: nome.trim(), email: email.trim() });
      }
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setSaving(false);
    }
  }
  function handleCancelar() { router.back(); }

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} accessibilityRole="header">Editar Perfil</Text>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: user.avatarUrl ?? 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />
        </View>
        <View style={styles.form}>
          <TextInput label="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" autoCapitalize="words" returnKeyType="next" />
          <TextInput label="Email" value={email} onChangeText={setEmail} placeholder="email@exemplo.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} returnKeyType="done" />
          <Button variant="primary" size="lg" fullWidth onPress={handleSalvar} loading={saving} disabled={saving}>Salvar</Button>
          <Button variant="secondary" size="md" fullWidth onPress={handleCancelar} disabled={saving}>Cancelar</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const AVATAR_SIZE = 96;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  title: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, fontFamily: typography.fontFamily.arimo, color: colors.textPrimary, marginBottom: spacing.lg },
  avatarWrapper: { alignItems: 'center', marginBottom: spacing.lg },
  avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, backgroundColor: colors.backgroundDisabled },
  form: { borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.borderLight, backgroundColor: colors.background, padding: spacing.md, gap: spacing.sm },
});
