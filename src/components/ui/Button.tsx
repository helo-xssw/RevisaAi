import { borderRadius, colors, typography } from '@/theme/colors';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'md' | 'lg';

interface ButtonProps {
  children: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
}: ButtonProps) {
  const buttonStyles: ViewStyle[] = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles[`${variant}Disabled`],
  ].filter(Boolean) as ViewStyle[];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`${variant}Text`],
    disabled && styles[`${variant}TextDisabled`],
  ].filter(Boolean) as TextStyle[];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.textWhite : colors.primary}
        />
      ) : (
        <Text style={textStyles}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  fullWidth: {
    width: '100%',
  },

  // Variantes
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  primaryDisabled: {
    backgroundColor: colors.primaryDisabled,
    borderColor: colors.primaryDisabled,
  },
  secondary: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  secondaryDisabled: {
    backgroundColor: colors.backgroundDisabled,
    borderColor: colors.borderLight,
  },

  // Tamanhos
  md: {
    height: 48,
    paddingHorizontal: 24,
  },
  lg: {
    height: 56,
    paddingHorizontal: 32,
  },

  // Texto
  text: {
    fontFamily: typography.fontFamily.arimo,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize.md * 1.5,
  },
  primaryText: {
    color: colors.textWhite,
  },
  primaryTextDisabled: {
    color: colors.textWhite,
  },
  secondaryText: {
    color: colors.textPrimary,
  },
  secondaryTextDisabled: {
    color: colors.textSecondary,
  },
});
