import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { theme } from '../theme';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary && styles.btnPrimary,
        isSecondary && styles.btnSecondary,
        isOutline && styles.btnOutline,
        isGhost && styles.btnGhost,
        disabled && styles.btnDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isOutline || isGhost ? theme.colors.primary : theme.colors.white}
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              isPrimary && styles.textPrimary,
              isSecondary && styles.textSecondary,
              isOutline && styles.textOutline,
              isGhost && styles.textGhost,
              disabled && styles.textDisabled,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  btnPrimary: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.md,
  },
  btnSecondary: {
    backgroundColor: theme.colors.secondary,
    ...theme.shadows.md,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnDisabled: {
    opacity: 0.45,
  },
  text: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    fontWeight: '700',
  },
  textPrimary: {
    color: theme.colors.white,
  },
  textSecondary: {
    color: theme.colors.white,
  },
  textOutline: {
    color: theme.colors.primary,
  },
  textGhost: {
    color: theme.colors.primary,
  },
  textDisabled: {
    color: theme.colors.textMuted,
  },
});
