import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { colors, spacing, typography } from '@/theme/colors';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PerfilScreen() {
  // normalmente viriam do AuthContext
  const [nome, setNome] = useState('Usuário Exemplo');
  const [email, setEmail] = useState('usuario@exemplo.com');

  function handleSalvar() {
    Alert.alert('Perfil atualizado', `${nome} • ${email}`);
  }

  function handleSair() {
    Alert.alert('Sair', 'Aqui você pode chamar signOut() do AuthContext.');
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} testID="screen-perfil">
        <Text style={styles.title} accessibilityRole="header">Meu Perfil</Text>

        <View style={styles.form} accessible accessibilityLabel="Formulário de perfil">
          <TextInput
            label="Nome"
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome"
            autoCapitalize="words"
            returnKeyType="next"
            testID="input-nome"
          />
          <TextInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="email@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            testID="input-email"
          />

          <View style={{ gap: spacing.sm }}>
            <Button onPress={handleSalvar} variant="primary" size="lg" testID="btn-salvar-perfil">
              Salvar alterações
            </Button>
            <Button onPress={handleSair} variant="secondary" size="md" testID="btn-sair">
              Sair
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  title: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: spacing.sm },
  form: { gap: spacing.md },
});
