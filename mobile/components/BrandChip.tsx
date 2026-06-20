import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';

type BrandChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  emoji?: string;
};

export function BrandChip({ label, selected = false, onPress, emoji }: BrandChipProps) {
  const isDark = useColorScheme() === 'dark';

  const handlePress = () => {
    Haptics.selectionAsync();
    onPress?.();
  };

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isDark && styles.chipDark,
        selected && styles.chipSelected,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text
        style={[
          styles.label,
          isDark && styles.labelDark,
          selected && styles.labelSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipDark: {
    backgroundColor: Colors.surfaceDark,
    borderColor: Colors.borderDark,
  },
  chipSelected: {
    backgroundColor: Colors.primarySoft,
    borderColor: Colors.primary,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  labelDark: {
    color: Colors.textSecondaryDark,
  },
  labelSelected: {
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
});
