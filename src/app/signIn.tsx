import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { useAuth } from "@/hooks/useAuth";
import { borderRadius, colors, spacing, typography } from "@/theme/colors";
import { router } from "expo-router";
import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function SignIn() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Validação de email
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignIn = async () => {
        // Limpar erros anteriores
        setError("");
        setEmailError("");
        setPasswordError("");

        // Validações
        let hasError = false;

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

        if (hasError) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await signIn({ email: email.trim(), password });

            if (!result.success && result.error) {
                setError(result.error);
            }
        } catch (err) {
            setError("Erro ao fazer login. Tente novamente.");
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
                    <View style={styles.logoContainer}>
                        <Image 
                            source={require("@/assets/images/splash-icon.png")}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.header}>
                        <Text style={styles.title}>Bem-vindo de volta</Text>
                    </View>

                    {/* Formulário */}
                    <View style={styles.form}>
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
                            placeholder="Digite sua senha"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            autoComplete="password"
                            editable={!isLoading}
                            error={passwordError}
                        />

                        {/* Mensagem de erro geral */}
                        {error ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {/* Botão Entrar */}
                        <Button
                            onPress={handleSignIn}
                            disabled={isLoading}
                            loading={isLoading}
                            size="lg"
                        >
                            Entrar
                        </Button>

                        {/* Link para criar conta */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Não tem uma conta?{" "}
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push("/signUp" as any)}
                                disabled={isLoading}
                            >
                                <Text style={styles.linkText}>Criar conta</Text>
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