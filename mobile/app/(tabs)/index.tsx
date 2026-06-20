import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { AdCard } from '@/components/AdCard';
import { BrandChip } from '@/components/BrandChip';
import { Colors, Typography, Spacing, Radius, Shadows, formatMoney, getTruckImage, getAnuncioTitle, getLocation } from '@/lib/theme';
import { getAnunciosDestaque, getAnunciosRecentes } from '@/services/anuncios';
import type { Anuncio } from '@/types/anuncio';
import { CATEGORIAS, MARCAS } from '@/types/anuncio';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  const [destaques, setDestaques] = useState<Anuncio[]>([]);
  const [recentes, setRecentes] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());

  const bg = isDark ? Colors.backgroundDark : Colors.background;
  const surfaceColor = isDark ? Colors.surfaceDark : Colors.surface;
  const textColor = isDark ? Colors.textDark : Colors.text;
  const mutedColor = isDark ? Colors.textMutedDark : Colors.textMuted;
  const secondaryColor = isDark ? Colors.textSecondaryDark : Colors.textSecondary;
  const borderColor = isDark ? Colors.borderDark : Colors.border;

  const loadData = useCallback(async () => {
    try {
      const [dest, rec] = await Promise.all([
        getAnunciosDestaque(6),
        getAnunciosRecentes(12),
      ]);
      setDestaques(dest);
      setRecentes(rec);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleFavorite = useCallback((id: string) => {
    setFavoritos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: bg }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: bg }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: bg }]}>
        <View style={styles.headerTop}>
          <View style={styles.logoRow}>
            <Text style={styles.logoEmoji}>🚛</Text>
            <View>
              <Text style={[styles.logoTitle, { color: textColor }]}>Caminhões</Text>
              <Text style={[styles.logoSub, { color: mutedColor }]}>à Venda</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.headerBtn, { backgroundColor: isDark ? Colors.surfaceSecondaryDark : Colors.surfaceSecondary }]}
              onPress={() => router.push('/(tabs)/buscar')}
            >
              <Ionicons name="search-outline" size={20} color={textColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerBtn, { backgroundColor: isDark ? Colors.surfaceSecondaryDark : Colors.surfaceSecondary }]}
            >
              <Ionicons name="notifications-outline" size={20} color={textColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search bar tap */}
        <TouchableOpacity
          style={[styles.searchTap, { backgroundColor: surfaceColor, borderColor }]}
          onPress={() => router.push('/(tabs)/buscar')}
          activeOpacity={0.8}
        >
          <Ionicons name="search-outline" size={18} color={mutedColor} />
          <Text style={[styles.searchTapText, { color: mutedColor }]}>
            Buscar marca, modelo, cidade...
          </Text>
          <View style={[styles.searchFilter, { backgroundColor: Colors.primarySoft }]}>
            <Ionicons name="options-outline" size={16} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Categorias ─────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat.slug}
              style={[styles.categoryCard, { backgroundColor: surfaceColor, borderColor }]}
              onPress={() => router.push(`/categoria/${cat.slug}`)}
              activeOpacity={0.85}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={[styles.categoryLabel, { color: textColor }]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Destaques ──────────────────────────────────────────────────── */}
      {destaques.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionEyebrow, { color: Colors.primary }]}>Em destaque</Text>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Anúncios premium</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/buscar')}>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={destaques}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: Spacing.base, gap: Spacing.md }}
            renderItem={({ item }) => (
              <AdCard
                anuncio={item}
                variant="featured"
                isFavorite={favoritos.has(item.id)}
                onFavorite={handleFavorite}
              />
            )}
          />
        </View>
      )}

      {/* ── Marcas ─────────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Por marca</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {MARCAS.map((marca) => (
            <BrandChip
              key={marca}
              label={marca}
              onPress={() => router.push({ pathname: '/(tabs)/buscar', params: { marca } })}
            />
          ))}
        </ScrollView>
      </View>

      {/* ── Recentes ───────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionEyebrow, { color: secondaryColor }]}>Recém adicionados</Text>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Últimos anúncios</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/buscar')}>
            <Text style={styles.seeAll}>Ver todos →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          {recentes.map((item) => (
            <AdCard
              key={item.id}
              anuncio={item}
              variant="grid"
              isFavorite={favoritos.has(item.id)}
              onFavorite={handleFavorite}
            />
          ))}
        </View>
      </View>

      {/* ── Stats Banner ───────────────────────────────────────────────── */}
      <View style={[styles.statsBanner, { backgroundColor: Colors.primary }]}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>+5.000</Text>
          <Text style={styles.statLabel}>Anúncios</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>9</Text>
          <Text style={styles.statLabel}>Marcas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>15</Text>
          <Text style={styles.statLabel}>Estados</Text>
        </View>
      </View>

      {/* ── CTA Anunciar ───────────────────────────────────────────────── */}
      <View style={[styles.ctaBanner, { backgroundColor: surfaceColor, borderColor }]}>
        <View style={styles.ctaContent}>
          <Text style={styles.ctaEmoji}>📢</Text>
          <View style={styles.ctaText}>
            <Text style={[styles.ctaTitle, { color: textColor }]}>Quer vender seu caminhão?</Text>
            <Text style={[styles.ctaDesc, { color: secondaryColor }]}>
              Anuncie grátis e alcance milhares de compradores
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/(tabs)/anuncios')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaButtonText}>Anunciar grátis</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Header
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoEmoji: { fontSize: 28 },
  logoTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.black,
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  logoSub: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    lineHeight: 14,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search tap
  searchTap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.xl,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchTapText: {
    flex: 1,
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  searchFilter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sections
  section: { marginTop: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  sectionEyebrow: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
  seeAll: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },

  // Categories
  chipsContainer: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderRadius: Radius.xl,
    borderWidth: 1,
    minWidth: 80,
  },
  categoryEmoji: { fontSize: 24 },
  categoryLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
  },

  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },

  // Stats
  statsBanner: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    marginTop: Spacing.xl,
    borderRadius: Radius['2xl'],
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statNumber: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.black,
    color: Colors.textInverse,
  },
  statLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  // CTA
  ctaBanner: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.lg,
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  ctaEmoji: { fontSize: 32 },
  ctaText: { flex: 1 },
  ctaTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    marginBottom: 2,
  },
  ctaDesc: {
    fontSize: Typography.sm,
    lineHeight: 18,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  ctaButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
});
