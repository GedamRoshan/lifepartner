import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { theme } from '../theme';

export interface ChipSelectorOption {
  label: string
  value: string;
}

export interface ChipSelectorProps {
  label?: string;
  options: (string | ChipSelectorOption)[];
  selectedValue: string;
  onSelect: (value: string) => void;
  horizontal?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ChipSelector: React.FC<ChipSelectorProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  horizontal = true,
  fullWidth = false,
  style,
}) => {
  const normalizedOptions: ChipSelectorOption[] = options.map(opt =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const renderChips = () => (
    <View style={[fullWidth ? styles.fullWidthRow : styles.chipRow, style]}>
      {normalizedOptions.map(item => {
        const isSelected = selectedValue === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.chip,
              fullWidth && styles.fullWidthChip,
              isSelected && styles.chipActive,
            ]}
            onPress={() => onSelect(item.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {horizontal && !fullWidth ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderChips()}
        </ScrollView>
      ) : (
        renderChips()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  scrollContent: {
    paddingVertical: 2,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  fullWidthRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidthChip: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
    fontWeight: '700',
  },
});
