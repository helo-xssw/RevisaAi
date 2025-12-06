import { Button } from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { useAuth } from "@/hooks/useAuth";
import { borderRadius, colors, spacing, typography } from "@/theme/colors";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SignUp() {
    const { signUp } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    // Validação de email
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignUp = async () => {
        // Limpar erros anteriores
        setError("");
        setNameError("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");

        // Validações
        let hasError = false;

        if (!name.trim()) {
            setNameError("O nome é obrigatório.");
            hasError = true;
        } else if (name.trim().length < 3) {
            setNameError("O nome deve ter no mínimo 3 caracteres.");
            hasError = true;
        }

        if (!email.trim()) {
            setEmailError("O e-mail é obrigatório.");
            hasError = true;
        } else if (!isValidEmail(email)) {
            setEmailError("Por favor, insira um e-mail válido.");
            hasError = true;
        }

        if (!password.trim()) {
            setPasswordError("A senha é obrigatória.");
            hasError = true;
        } else if (password.length < 4) {
            setPasswordError("A senha deve ter no mínimo 4 caracteres.");
            hasError = true;
        }

        if (!confirmPassword.trim()) {
            setConfirmPasswordError("Confirme sua senha.");
            hasError = true;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("As senhas não coincidem.");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        setIsLoading(true);

        try {
            // Chamada para a API de cadastro
            // Login automático é feito dentro do signUp do contexto
            const result = await signUp({
                name: name.trim(),
                email: email.trim(),
                password,
            });

            if (!result.success && result.error) {
                setError(result.error);
            }
            // Se success === true, o usuário é redirecionado automaticamente para "/"
        } catch (err) {
            setError("Erro ao criar conta. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >

                    {/* Cabeçalho */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Criar conta</Text>
                        <Text style={styles.subtitle}>
                            Entre para o RevisaAI e tenha controle total das revisões, serviços e agendamentos da sua moto.
                        </Text>
                    </View>

                    {/* Formulário */}
                    <View style={styles.form}>
                        <TextInput
                            label="Nome completo"
                            placeholder="Seu nome"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            autoComplete="name"
                            editable={!isLoading}
                            error={nameError}
                        />

                        <TextInput
                            label="E-mail"
                            placeholder="seu@email.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            autoComplete="email"
                            editable={!isLoading}
                            error={emailError}
                        />

                        <TextInput
                            label="Senha"
                            placeholder="Crie uma senha"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            autoComplete="password-new"
                            editable={!isLoading}
                            error={passwordError}
                        />

                        <TextInput
                            label="Confirmar senha"
                            placeholder="Digite a senha novamente"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            autoComplete="password-new"
                            editable={!isLoading}
                            error={confirmPasswordError}
                        />

                        {/* Mensagem de erro geral */}
                        {error ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {/* Botão Registrar */}
                        <Button
                            onPress={handleSignUp}
                            disabled={isLoading}
                            loading={isLoading}
                            size="lg"
                        >
                            Registrar
                        </Button>

                        {/* Link para login */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Já tem uma conta?{" "}
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.back()}
                                disabled={isLoading}
                            >
                                <Text style={styles.linkText}>Entrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: spacing.lg,
        justifyContent: "center",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: spacing.xl,
    },
    logoImage: {
        width: 100,
        height: 100,
    },
    header: {
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: typography.fontSize.xxl,
        fontWeight: typography.fontWeight.bold,
        fontFamily: typography.fontFamily.arimo,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.fontSize.md,
        fontFamily: typography.fontFamily.inter,
        color: colors.textSecondary,
        lineHeight: typography.fontSize.md * 1.4,
    },
    form: {
        width: "100%",
    },
    errorContainer: {
        backgroundColor: "#FEE2E2",
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
    },
    errorText: {
        color: colors.textError,
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.inter,
        textAlign: "center",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: spacing.lg,
    },
    footerText: {
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.inter,
        color: colors.textSecondary,
    },
    linkText: {
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.arimo,
        color: colors.primary,
        fontWeight: typography.fontWeight.semibold,
    },
});
