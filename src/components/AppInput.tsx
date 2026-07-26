import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../theme';

export interface AppInputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  onPressContainer?: () => void;
  isTouchable?: boolean;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  icon,
  rightElement,
  onPressContainer,
  isTouchable = false,
  style,
  value,
  placeholder,
  ...props
}) => {
  const content = (
    <View style={styles.inputContainer}>
      {icon}
      {isTouchable ? (
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
      ) : (
        <TextInput
          style={[styles.input, style]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          value={value}
          {...props}
        />
      )}
      {rightElement}
    </View>
  );

  return (
    <View style={styles.inputGroup}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {isTouchable && onPressContainer ? (
        <TouchableOpacity activeOpacity={0.8} onPress={onPressContainer}>
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    gap: 10,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.text,
  },
  inputText: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.text,
  },
  placeholderText: {
    color: theme.colors.textMuted,
  },
});
