import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Header } from '@/components/Header';
import { AdCard } from '@/components/AdCard';
import { EmptyState } from '@/components/EmptyState';
import { Colors, Typography, Spacing } from '@/lib/theme';
import { getAnuncios } from '@/services/anuncios';
import type { Anuncio } from '@/types/anuncio';
import { CATEGORIAS } from '@/types/anuncio';

const CATEGORIA_QUERY_MAP: Record<string, string> = {
  caminhoes: 'caminhão',
  carretas: 'carreta',
  implementos: 'implemento',
  maquinas: 'máquina',
  pecas: 'peça',
};

export default function CategoriaScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());

  const bg = isDark ? Colors.backgroundDark : Colors.background;
  const textColor = isDark ? Colors.textDark : Colors.text;

  const categoria = CATEGORIAS.find((c) => c.slug === slug);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const q = CATEGORIA_QUERY_MAP[slug] || slug;
      const data = await getAnuncios({ q }, 30);
      setAnuncios(data);
      setLoading(false);
    })();
  }, [slug]);

  const handleFavorite = useCallback((id: string) => {
    setFavoritos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Header
        title={categoria ? `${categoria.emoji} ${categoria.label}` : 'Categoria'}
        showBack
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : anuncios.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="Nenhum anúncio nesta categoria"
          description="Tente buscar em outras categorias"
          actionLabel="Voltar"
          onAction={() => router.back()}
        />
      ) : (
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
          ListHeaderComponent={
            <Text style={[styles.resultsCount, { color: isDark ? Colors.textMutedDark : Colors.textMuted }]}>
              {anuncios.length} resultado{anuncios.length !== 1 ? 's' : ''}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: {
    padding: Spacing.base,
    paddingBottom: 100,
  },
  resultsCount: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    marginBottom: Spacing.md,
  },
});
