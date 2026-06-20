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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdCard } from '@/components/AdCard';
import { EmptyState } from '@/components/EmptyState';
import { Colors, Typography, Spacing } from '@/lib/theme';
import { getAnunciosFavoritos } from '@/services/anuncios';
import type { Anuncio } from '@/types/anuncio';

const FAVORITOS_KEY = '@caminhoes:favoritos';

export default function FavoritosScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [favIds, setFavIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const bg = isDark ? Colors.backgroundDark : Colors.background;
  const textColor = isDark ? Colors.textDark : Colors.text;
  const borderColor = isDark ? Colors.borderDark : Colors.border;

  const loadFavoritos = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITOS_KEY);
      const ids: string[] = stored ? JSON.parse(stored) : [];
      setFavIds(ids);
      if (ids.length > 0) {
        const data = await getAnunciosFavoritos(ids);
        setAnuncios(data);
      } else {
        setAnuncios([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavoritos();
  }, [loadFavoritos]);

  const handleFavorite = useCallback(async (id: string) => {
    const newIds = favIds.includes(id)
      ? favIds.filter((f) => f !== id)
      : [...favIds, id];
    setFavIds(newIds);
    await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(newIds));
    setAnuncios((prev) => prev.filter((a) => newIds.includes(a.id)));
  }, [favIds]);

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: borderColor }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Favoritos</Text>
        {anuncios.length > 0 && (
          <Text style={[styles.headerCount, { color: Colors.textMuted }]}>
            {anuncios.length} salvo{anuncios.length !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : anuncios.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Nenhum favorito ainda"
          description="Salve os anúncios que você curtir para encontrá-los aqui facilmente"
          actionLabel="Explorar anúncios"
          onAction={() => {}}
        />
      ) : (
        <FlatList
          data={anuncios}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AdCard
              anuncio={item}
              variant="list"
              isFavorite={true}
              onFavorite={handleFavorite}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    gap: 4,
  },
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.black,
  },
  headerCount: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  listContent: {
    padding: Spacing.base,
    paddingBottom: 100,
  },
});
