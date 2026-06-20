import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';

type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon = 'search-outline',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, isDark && styles.iconContainerDark]}>
        <Ionicons
          name={icon}
          size={40}
          color={isDark ? Colors.textMutedDark : Colors.textMuted}
        />
      </View>
      <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
      {description && (
        <Text style={[styles.description, isDark && styles.descriptionDark]}>
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction} activeOpacity={0.85}>
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
    gap: Spacing.md,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainerDark: {
    backgroundColor: Colors.surfaceSecondaryDark,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  titleDark: {
    color: Colors.textDark,
  },
  description: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  descriptionDark: {
    color: Colors.textSecondaryDark,
  },
  actionButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.xl,
  },
  actionButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
});
