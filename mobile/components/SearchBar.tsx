import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Buscar caminhões, marca, modelo...',
  autoFocus = false,
}: SearchBarProps) {
  const isDark = useColorScheme() === 'dark';
  const [focused, setFocused] = useState(false);

  const handleClear = useCallback(() => {
    onChangeText('');
  }, [onChangeText]);

  const bgColor = isDark ? Colors.surfaceDark : Colors.surface;
  const borderColor = focused
    ? Colors.primary
    : isDark
    ? Colors.borderDark
    : Colors.border;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderColor,
          borderWidth: focused ? 2 : 1,
        },
      ]}
    >
      <Ionicons
        name="search-outline"
        size={20}
        color={focused ? Colors.primary : isDark ? Colors.textMutedDark : Colors.textMuted}
        style={styles.icon}
      />
      <TextInput
        style={[
          styles.input,
          { color: isDark ? Colors.textDark : Colors.text },
        ]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={isDark ? Colors.textMutedDark : Colors.textMuted}
        returnKeyType="search"
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View style={styles.clearButton}>
            <Ionicons
              name="close"
              size={14}
              color={isDark ? Colors.textMutedDark : Colors.textMuted}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    height: 48,
    gap: Spacing.sm,
  },
  icon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    padding: 0,
    margin: 0,
  },
  clearButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
