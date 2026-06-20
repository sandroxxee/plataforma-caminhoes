import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SearchBar } from '@/components/SearchBar';
import { AdCard } from '@/components/AdCard';
import { BrandChip } from '@/components/BrandChip';
import { EmptyState } from '@/components/EmptyState';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';
import { getAnuncios } from '@/services/anuncios';
import type { Anuncio } from '@/types/anuncio';
import { MARCAS, ESTADOS, FAIXAS_PRECO } from '@/types/anuncio';

type ViewMode = 'grid' | 'list';

export default function BuscarScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ marca?: string; q?: string }>();

  const [query, setQuery] = useState(params.q || '');
  const [marcaSelecionada, setMarcaSelecionada] = useState(params.marca || '');
  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [faixaSelecionada, setFaixaSelecionada] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showFilters, setShowFilters] = useState(false);

  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bg = isDark ? Colors.backgroundDark : Colors.background;
  const surfaceColor = isDark ? Colors.surfaceDark : Colors.surface;
  const textColor = isDark ? Colors.textDark : Colors.text;
  const mutedColor = isDark ? Colors.textMutedDark : Colors.textMuted;
  const borderColor = isDark ? Colors.borderDark : Colors.border;

  const hasFilters = !!marcaSelecionada || !!estadoSelecionado || faixaSelecionada > 0;
  const activeFiltersCount = [marcaSelecionada, estadoSelecionado, faixaSelecionada > 0].filter(Boolean).length;

  const buscar = useCallback(async (q: string, marca: string, estado: string, faixa: number) => {
    setLoading(true);
    const faixaObj = FAIXAS_PRECO[faixa];
    const filtros: Record<string, string | number | undefined> = {};
    if (q) filtros.q = q;
    if (marca) filtros.marca = marca;
    if (estado) filtros.estado = estado;

    const data = await getAnuncios(filtros, 30);
    const filtered = faixa > 0
      ? data.filter((a) => {
          const p = a.preco || 0;
          return p >= faixaObj.min && (faixaObj.max === Infinity || p <= faixaObj.max);
        })
      : data;

    setAnuncios(filtered);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      buscar(query, marcaSelecionada, estadoSelecionado, faixaSelecionada);
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [query, marcaSelecionada, estadoSelecionado, faixaSelecionada, buscar]);

  const handleFavorite = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFavoritos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setMarcaSelecionada('');
    setEstadoSelecionado('');
    setFaixaSelecionada(0);
    setShowFilters(false);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: bg, borderBottomColor: borderColor }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Buscar</Text>
        <View style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              autoFocus={false}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              { backgroundColor: hasFilters ? Colors.primarySoft : (isDark ? Colors.surfaceSecondaryDark : Colors.surfaceSecondary) },
              hasFilters && { borderColor: Colors.primary, borderWidth: 1.5 },
            ]}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={hasFilters ? Colors.primary : textColor}
            />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Chips de filtros ativos */}
        {hasFilters && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeFiltersRow}
          >
            {marcaSelecionada && (
              <TouchableOpacity
                style={styles.activeFilterChip}
                onPress={() => setMarcaSelecionada('')}
              >
                <Text style={styles.activeFilterText}>{marcaSelecionada}</Text>
                <Ionicons name="close" size={12} color={Colors.primary} />
              </TouchableOpacity>
            )}
            {estadoSelecionado && (
              <TouchableOpacity
                style={styles.activeFilterChip}
                onPress={() => setEstadoSelecionado('')}
              >
                <Text style={styles.activeFilterText}>{estadoSelecionado}</Text>
                <Ionicons name="close" size={12} color={Colors.primary} />
              </TouchableOpacity>
            )}
            {faixaSelecionada > 0 && (
              <TouchableOpacity
                style={styles.activeFilterChip}
                onPress={() => setFaixaSelecionada(0)}
              >
                <Text style={styles.activeFilterText}>{FAIXAS_PRECO[faixaSelecionada].label}</Text>
                <Ionicons name="close" size={12} color={Colors.primary} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearAll}>Limpar tudo</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Resultados + toggle */}
        <View style={styles.resultsRow}>
          <Text style={[styles.resultsCount, { color: mutedColor }]}>
            {loading ? 'Buscando...' : `${anuncios.length} resultado${anuncios.length !== 1 ? 's' : ''}`}
          </Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons name="list-outline" size={18} color={viewMode === 'list' ? Colors.primary : mutedColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, viewMode === 'grid' && styles.toggleBtnActive]}
              onPress={() => setViewMode('grid')}
            >
              <Ionicons name="grid-outline" size={18} color={viewMode === 'grid' ? Colors.primary : mutedColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Lista ──────────────────────────────────────────────────────── */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : anuncios.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="Nenhum resultado"
          description="Tente outros termos ou remova os filtros"
          actionLabel="Limpar filtros"
          onAction={clearFilters}
        />
      ) : viewMode === 'list' ? (
        <FlatList
          data={anuncios}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AdCard
              anuncio={item}
              variant="list"
              isFavorite={favoritos.has(item.id)}
              onFavorite={handleFavorite}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={anuncios}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <AdCard
              anuncio={item}
              variant="grid"
              isFavorite={favoritos.has(item.id)}
              onFavorite={handleFavorite}
            />
          )}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={{ gap: Spacing.sm }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ── Modal de Filtros ───────────────────────────────────────────── */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: bg }]}>
          <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Filtros</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.modalContent}>
            {/* Marca */}
            <Text style={[styles.filterLabel, { color: textColor }]}>Marca</Text>
            <View style={styles.filterChips}>
              {MARCAS.map((m) => (
                <BrandChip
                  key={m}
                  label={m}
                  selected={marcaSelecionada === m}
                  onPress={() => setMarcaSelecionada(marcaSelecionada === m ? '' : m)}
                />
              ))}
            </View>

            {/* Estado */}
            <Text style={[styles.filterLabel, { color: textColor }]}>Estado</Text>
            <View style={styles.filterChips}>
              {ESTADOS.map((e) => (
                <BrandChip
                  key={e}
                  label={e}
                  selected={estadoSelecionado === e}
                  onPress={() => setEstadoSelecionado(estadoSelecionado === e ? '' : e)}
                />
              ))}
            </View>

            {/* Faixa de preço */}
            <Text style={[styles.filterLabel, { color: textColor }]}>Faixa de preço</Text>
            <View style={styles.filterChips}>
              {FAIXAS_PRECO.map((f, i) => (
                <BrandChip
                  key={i}
                  label={f.label}
                  selected={faixaSelecionada === i}
                  onPress={() => setFaixaSelecionada(i)}
                />
              ))}
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: borderColor }]}>
            <TouchableOpacity
              style={[styles.clearBtn, { borderColor }]}
              onPress={clearFilters}
            >
              <Text style={[styles.clearBtnText, { color: textColor }]}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyBtnText}>Aplicar filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.black,
  },
  searchRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
  },
  activeFiltersRow: {
    gap: Spacing.sm,
    alignItems: 'center',
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primarySoft,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  activeFilterText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  clearAll: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.error,
    paddingHorizontal: Spacing.sm,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsCount: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 4,
  },
  toggleBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    backgroundColor: Colors.primarySoft,
  },

  listContent: {
    padding: Spacing.base,
    paddingBottom: 100,
  },
  gridContent: {
    padding: Spacing.base,
    paddingBottom: 100,
  },

  // Modal
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    paddingTop: Spacing.xl,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
  modalContent: {
    padding: Spacing.base,
    gap: Spacing.md,
    paddingBottom: Spacing['3xl'],
  },
  filterLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.base,
    paddingBottom: Spacing['2xl'],
    borderTopWidth: 1,
  },
  clearBtn: {
    flex: 1,
    height: 52,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  clearBtnText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  applyBtn: {
    flex: 2,
    height: 52,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
  },
});
