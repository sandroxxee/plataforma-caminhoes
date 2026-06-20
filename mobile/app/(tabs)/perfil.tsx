import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/lib/supabase';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';
import type { User } from '@supabase/supabase-js';

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  onPress: () => void;
  danger?: boolean;
  badge?: string;
};

function MenuItem({ icon, label, description, onPress, danger = false, badge }: MenuItemProps) {
  const isDark = useColorScheme() === 'dark';
  const surfaceColor = isDark ? Colors.surfaceDark : Colors.surface;
  const textColor = isDark ? Colors.textDark : Colors.text;
  const secondaryColor = isDark ? Colors.textSecondaryDark : Colors.textSecondary;
  const borderColor = isDark ? Colors.borderDark : Colors.border;
  const iconColor = danger ? Colors.error : Colors.primary;

  return (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: surfaceColor, borderColor }]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      activeOpacity={0.85}
    >
      <View style={[styles.menuIcon, { backgroundColor: danger ? Colors.errorSoft : Colors.primarySoft }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, { color: danger ? Colors.error : textColor }]}>{label}</Text>
        {description && (
          <Text style={[styles.menuDesc, { color: secondaryColor }]}>{description}</Text>
        )}
      </View>
      {badge && (
        <View style={styles.menuBadge}>
          <Text style={styles.menuBadgeText}>{badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={16} color={isDark ? Colors.textMutedDark : Colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function PerfilScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | null>(null);

  const bg = isDark ? Colors.backgroundDark : Colors.background;
  const surfaceColor = isDark ? Colors.surfaceDark : Colors.surface;
  const textColor = isDark ? Colors.textDark : Colors.text;
  const secondaryColor = isDark ? Colors.textSecondaryDark : Colors.textSecondary;
  const borderColor = isDark ? Colors.borderDark : Colors.border;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          setUser(null);
        },
      },
    ]);
  };

  const avatarInitial = user?.email?.[0]?.toUpperCase() || '?';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: bg }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Perfil</Text>
      </View>

      {/* Avatar / Login */}
      {user ? (
        <View style={[styles.userCard, { backgroundColor: surfaceColor, borderColor }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarInitial}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: textColor }]}>
              {user.user_metadata?.full_name || 'Usuário'}
            </Text>
            <Text style={[styles.userEmail, { color: secondaryColor }]}>{user.email}</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          </View>
        </View>
      ) : (
        <View style={[styles.loginCard, { backgroundColor: Colors.primary }]}>
          <Text style={styles.loginEmoji}>👤</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.loginTitle}>Entre na sua conta</Text>
            <Text style={styles.loginDesc}>Salve favoritos e gerencie seus anúncios</Text>
          </View>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push('/login')}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Menu principal */}
      <View style={[styles.menuSection, { paddingHorizontal: Spacing.base }]}>
        <Text style={[styles.menuSectionTitle, { color: secondaryColor }]}>Minha conta</Text>
        <View style={styles.menuGroup}>
          {user && (
            <>
              <MenuItem
                icon="megaphone-outline"
                label="Meus anúncios"
                description="Gerencie seus anúncios publicados"
                onPress={() => Linking.openURL('https://caminhoes.app/painel/anuncios')}
              />
              <MenuItem
                icon="heart-outline"
                label="Favoritos"
                description="Anúncios que você salvou"
                onPress={() => router.push('/(tabs)/favoritos')}
              />
              <MenuItem
                icon="notifications-outline"
                label="Alertas de busca"
                description="Seja notificado de novos anúncios"
                onPress={() => Linking.openURL('https://caminhoes.app/painel/alertas')}
              />
            </>
          )}
          <MenuItem
            icon="add-circle-outline"
            label="Publicar anúncio"
            description="Anuncie seu caminhão gratuitamente"
            onPress={() => router.push('/(tabs)/anuncios')}
          />
        </View>
      </View>

      {/* Menu suporte */}
      <View style={[styles.menuSection, { paddingHorizontal: Spacing.base }]}>
        <Text style={[styles.menuSectionTitle, { color: secondaryColor }]}>Suporte</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="help-circle-outline"
            label="Como funciona"
            onPress={() => Linking.openURL('https://caminhoes.app/como-funciona')}
          />
          <MenuItem
            icon="logo-whatsapp"
            label="Falar pelo WhatsApp"
            description="Atendimento rápido"
            onPress={() => Linking.openURL('https://wa.me/5549999999999')}
          />
          <MenuItem
            icon="document-text-outline"
            label="Termos e privacidade"
            onPress={() => Linking.openURL('https://caminhoes.app/politica-de-privacidade')}
          />
          <MenuItem
            icon="star-outline"
            label="Avaliar o app"
            onPress={() => Linking.openURL('https://play.google.com/store')}
          />
        </View>
      </View>

      {/* Logout */}
      {user && (
        <View style={[styles.menuSection, { paddingHorizontal: Spacing.base }]}>
          <View style={styles.menuGroup}>
            <MenuItem
              icon="log-out-outline"
              label="Sair da conta"
              onPress={handleLogout}
              danger
            />
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: isDark ? Colors.textMutedDark : Colors.textMuted }]}>
          Caminhões à Venda v1.0.0
        </Text>
        <Text style={[styles.footerText, { color: isDark ? Colors.textMutedDark : Colors.textMuted }]}>
          © 2026 Todos os direitos reservados
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.black,
  },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginHorizontal: Spacing.base,
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    padding: Spacing.base,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Typography.xl,
    fontWeight: Typography.black,
    color: Colors.textInverse,
  },
  userInfo: { flex: 1 },
  userName: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: Typography.sm,
  },
  verifiedBadge: {
    padding: 4,
  },

  loginCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginHorizontal: Spacing.base,
    borderRadius: Radius['2xl'],
    padding: Spacing.base,
  },
  loginEmoji: { fontSize: 32 },
  loginTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
    marginBottom: 2,
  },
  loginDesc: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  loginBtn: {
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  loginBtnText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },

  menuSection: { marginTop: Spacing.xl, gap: Spacing.sm },
  menuSectionTitle: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  menuGroup: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    gap: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderRadius: Radius.xl,
    marginBottom: Spacing.sm,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: { flex: 1 },
  menuLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    marginBottom: 1,
  },
  menuDesc: {
    fontSize: Typography.xs,
  },
  menuBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  menuBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
  },

  footer: {
    alignItems: 'center',
    gap: 4,
    padding: Spacing.xl,
    marginTop: Spacing.xl,
  },
  footerText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
  },
});
