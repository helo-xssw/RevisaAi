import { borderRadius, colors, spacing, typography } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    TextInput as RNTextInput,
    StyleSheet,
    Text,
    TextInputProps,
    View,
} from 'react-native';

interface CustomTextInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  containerStyle?: any;
}

export default function CustomTextInput({
  label,
  error,
  containerStyle,
  onFocus,
  onBlur,
  ...rest
}: CustomTextInputProps) {
  const [focused, setFocused] = useState(false);

  function handleFocus(e: any) {
    setFocused(true);
    onFocus?.(e);
  }

  function handleBlur(e: any) {
    setFocused(false);
    onBlur?.(e);
  }

  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputWrapper}>
        <RNTextInput
          {...rest}
          style={[
            styles.input,
            focused && styles.inputFocused,
            hasError && styles.inputError,
          ]}
          placeholderTextColor={colors.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {hasError && (
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color={colors.textError}
            style={styles.errorIcon}
          />
        )}
      </View>

      {hasError && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.arimo,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: 48,
    borderRadius: borderRadius.lg,
    borderWidth: 1.3,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.md,
    paddingRight: spacing.lg + 8, // espaço pra ícone de erro
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.inter,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.borderError,
  },
  errorIcon: {
    position: 'absolute',
    right: spacing.sm,
    top: '50%',
    marginTop: -9, // metade do tamanho do ícone
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.inter,
    color: colors.textError,
    marginTop: spacing.xs,
  },
});
