import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Typography, Spacing } from '@/lib/theme';

type HeaderProps = {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotification?: boolean;
  rightAction?: React.ReactNode;
  transparent?: boolean;
};

export function Header({
  title,
  showBack = false,
  showSearch = false,
  showNotification = false,
  rightAction,
  transparent = false,
}: HeaderProps) {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  const bgColor = transparent
    ? 'transparent'
    : isDark
    ? Colors.backgroundDark
    : Colors.background;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8, backgroundColor: bgColor },
        !transparent && {
          borderBottomWidth: 1,
          borderBottomColor: isDark ? Colors.borderDark : Colors.border,
        },
      ]}
    >
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity
            style={[styles.iconButton, isDark && styles.iconButtonDark]}
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={isDark ? Colors.textDark : Colors.text}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.logo}>
            <Text style={styles.logoEmoji}>🚛</Text>
            <Text style={[styles.logoText, isDark && styles.logoTextDark]}>
              Caminhões
            </Text>
          </View>
        )}

        {title && (
          <Text
            style={[styles.title, isDark && styles.titleDark]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}

        <View style={styles.actions}>
          {showSearch && (
            <TouchableOpacity
              style={[styles.iconButton, isDark && styles.iconButtonDark]}
              onPress={() => router.push('/(tabs)/buscar')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="search-outline"
                size={22}
                color={isDark ? Colors.textDark : Colors.text}
              />
            </TouchableOpacity>
          )}
          {showNotification && (
            <TouchableOpacity
              style={[styles.iconButton, isDark && styles.iconButtonDark]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={isDark ? Colors.textDark : Colors.text}
              />
            </TouchableOpacity>
          )}
          {rightAction}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoEmoji: {
    fontSize: 22,
  },
  logoText: {
    fontSize: Typography.lg,
    fontWeight: Typography.black,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  logoTextDark: {
    color: Colors.textDark,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.sm,
  },
  titleDark: {
    color: Colors.textDark,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonDark: {
    backgroundColor: Colors.surfaceSecondaryDark,
  },
});
