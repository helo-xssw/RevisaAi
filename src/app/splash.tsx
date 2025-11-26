import { useAuth } from "@/hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

// Prevenir auto-hide do splash nativo
SplashScreen.preventAutoHideAsync();


export default function Splash() {
    const { isReady, isLoggedIn } = useAuth();

    // Valores animados
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        // Esconder splash nativo
        SplashScreen.hideAsync();

        // Animação de entrada suave
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1.05,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        if (isReady) {
            // Delay para suavidade (1.5s total na tela)
            const timer = setTimeout(() => {
                // Animação de saída
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    // Redirecionamento após animação
                    if (!isLoggedIn) {
                        router.replace("/signIn");
                    } else {
                        router.replace("/(protected)");
                    }
                });
            }, 1200);

            return () => clearTimeout(timer);
        }
    }, [isReady, isLoggedIn]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Círculo decorativo inferior esquerdo - Gradiente */}
            <LinearGradient
                colors={["#D42B2B", "#6E1616"]}
                style={styles.circleBottomLeft}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />

            {/* Círculo decorativo superior direito */}
            <View style={styles.circleTopRight} />

            {/* Conteúdo central */}
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {/* Logo SVG do RevisaAI */}
                <View style={styles.logoContainer}>
                    <Image 
                        source={require("@/assets/images/splash-icon.png")}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Texto com tagline */}
                <View style={styles.textContainer}>
                    <Text style={styles.brandName}>RevisaAI</Text>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    circleBottomLeft: {
        position: "absolute",
        left: -275,
        bottom: -296,
        width: 508,
        height: 505,
        borderRadius: 254,
    },
    circleTopRight: {
        position: "absolute",
        right: -164,
        top: -86,
        width: 228,
        height: 212,
        borderRadius: 114,
        backgroundColor: "#D42B2B",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    logoContainer: {
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    logoImage: {
        width: 135,
        height: 135,
    },
    textContainer: {
        alignItems: "center",
        marginTop: 16,
    },
    brandName: {
        fontFamily: "Inter",
        fontWeight: "600",
        fontSize: 22,
        lineHeight: 26.63,
        color: "#000000",
        marginBottom: 8,
        textShadowColor: "rgba(0, 0, 0, 0.3)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    tagline: {
        fontFamily: "Inter",
        fontWeight: "400",
        fontSize: 16,
        color: "#6B7280",
        letterSpacing: 0.5,
    },
});
