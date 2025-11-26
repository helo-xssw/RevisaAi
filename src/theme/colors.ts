/**
 * Design Tokens - Cores do Sistema
 * Baseado no Figma Design System
 */

export const colors = {
  // Cores Primárias
  primary: '#D42B2B',
  primaryHover: '#B92424',
  primaryPressed: '#A01F1F',
  primaryDisabled: '#F5A5A5',

  // Cores de Texto
  textPrimary: '#1C1C1C',
  textSecondary: '#6B7280',
  textWhite: '#FFFFFF',
  textError: '#DC2626',

  // Cores de Fundo
  background: '#FFFFFF',
  backgroundGray: '#F9FAFB',
  backgroundDisabled: '#F3F4F6',

  // Cores de Borda
  border: '#1C1C1C',
  borderLight: '#E5E7EB',
  borderError: '#DC2626',

  // Cores de Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#3B82F6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  fontFamily: {
    arimo: 'Arimo',
    inter: 'Inter',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};
