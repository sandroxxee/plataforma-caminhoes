import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Share,
  Linking,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, Spacing, Radius, Shadows, formatMoney, getLocation, getWhatsappLink, getAnuncioTitle } from '@/lib/theme';
import { getAnuncioById, incrementarViews } from '@/services/anuncios';
import type { Anuncio } from '@/types/anuncio';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FAVORITOS_KEY = '@caminhoes:favoritos';

type SpecItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  isDark: boolean;
};

function SpecItem({ icon, label, value, isDark }: SpecItemProps) {
  return (
    <View style={[styles.specItem, { backgroundColor: isDark ? Colors.surfaceSecondaryDark : Colors.surfaceSecondary }]}>
      <Ionicons name={icon} size={18} color={Colors.primary} />
      <View style={styles.specContent}>
        <Text style={[styles.specLabel, { color: isDark ? Colors.textMutedDark : Colors.textMuted }]}>{label}</Text>
        <Text style={[styles.specValue, { color: isDark ? Colors.textDark : Colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

export default function AnuncioDetalheScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [anuncio, setAnuncio] = useState<Anuncio | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const bg = isDark ? Colors.backgroundDark : Colors.background;
  const surfaceColor = isDark ? Colors.surfaceDark : Colors.surface;
  const textColor = isDark ? Colors.textDark : Colors.text;
  const secondaryColor = isDark ? Colors.textSecondaryDark : Colors.textSecondary;
  const borderColor = isDark ? Colors.borderDark : Colors.border;

  useEffect(() => {
    if (!id) return;
    (async () => {
      const data = await getAnuncioById(id);
      setAnuncio(data);
      setLoading(false);
      if (data) incrementarViews(data.id);

      // Check favorito
      const stored = await AsyncStorage.getItem(FAVORITOS_KEY);
      const ids: string[] = stored ? JSON.parse(stored) : [];
      setIsFavorite(ids.includes(id));
    })();
  }, [id]);

  const handleFavorite = useCallback(async () => {
    if (!anuncio) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const stored = await AsyncStorage.getItem(FAVORITOS_KEY);
    const ids: string[] = stored ? JSON.parse(stored) : [];
    let newIds: string[];
    if (isFavorite) {
      newIds = ids.filter((i) => i !== anuncio.id);
    } else {
      newIds = [...ids, anuncio.id];
    }
    await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(newIds));
    setIsFavorite(!isFavorite);
  }, [anuncio, isFavorite]);

  const handleShare = useCallback(async () => {
    if (!anuncio) return;
    const title = getAnuncioTitle(anuncio.titulo, anuncio.marca, anuncio.modelo);
    await Share.share({
      title,
      message: `${title} — ${formatMoney(anuncio.preco)}\nhttps://caminhoes.app/anuncios/${anuncio.id}`,
    });
  }, [anuncio]);

  const handleWhatsApp = useCallback(() => {
    if (!anuncio) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const title = getAnuncioTitle(anuncio.titulo, anuncio.marca, anuncio.modelo);
    const link = getWhatsappLink(anuncio.whatsapp, title);
    if (link) Linking.openURL(link);
  }, [anuncio]);

  const images = anuncio?.truck_images
    ?.filter((img) => img.image_url)
    .sort((a, b) => {
      if (a.principal && !b.principal) return -1;
      if (!a.principal && b.principal) return 1;
      return (a.ordem || 0) - (b.ordem || 0);
    }) || [];

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: bg }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!anuncio) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: bg }]}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.textMuted} />
        <Text style={[styles.notFoundText, { color: textColor }]}>Anúncio não encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const title = getAnuncioTitle(anuncio.titulo, anuncio.marca, anuncio.modelo);
  const location = getLocation(anuncio.cidade, anuncio.estado);
  const ano = anuncio.ano_modelo || anuncio.ano_fabricacao;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── Galeria ──────────────────────────────────────────────────── */}
        <View style={styles.galleryContainer}>
          {images.length > 0 ? (
            <>
              <FlatList
                data={images}
                keyExtractor={(_, i) => String(i)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                  setCurrentImageIndex(index);
                }}
                renderItem={({ item }) => (
                  <Image
                    source={item.image_url!}
                    style={styles.galleryImage}
                    contentFit="cover"
                    transition={200}
                  />
                )}
              />
              {images.length > 1 && (
                <View style={styles.imageDots}>
                  {images.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.imageDot,
                        i === currentImageIndex && styles.imageDotActive,
                      ]}
                    />
                  ))}
                </View>
              )}
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1}/{images.length}
                </Text>
              </View>
            </>
          ) : (
            <View style={[styles.galleryImage, styles.galleryPlaceholder]}>
              <Ionicons name="image-outline" size={48} color={Colors.textMuted} />
            </View>
          )}

          {/* Botões flutuantes */}
          <TouchableOpacity
            style={[styles.floatBtn, styles.floatBtnBack, { top: insets.top + 12 }]}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.textInverse} />
          </TouchableOpacity>
          <View style={[styles.floatBtnGroup, { top: insets.top + 12 }]}>
            <TouchableOpacity style={styles.floatBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color={Colors.textInverse} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatBtn} onPress={handleFavorite}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? Colors.error : Colors.textInverse}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Conteúdo ─────────────────────────────────────────────────── */}
        <View style={styles.content}>
          {/* Badges */}
          <View style={styles.badgeRow}>
            {anuncio.destaque && (
              <View style={styles.destaqueBadge}>
                <Ionicons name="star" size={12} color={Colors.warning} />
                <Text style={styles.destaqueBadgeText}>Destaque</Text>
              </View>
            )}
            {anuncio.marca && (
              <View style={[styles.marcaBadge, { backgroundColor: isDark ? Colors.surfaceSecondaryDark : Colors.surfaceSecondary }]}>
                <Text style={[styles.marcaBadgeText, { color: secondaryColor }]}>{anuncio.marca}</Text>
              </View>
            )}
          </View>

          {/* Título e preço */}
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          {ano && (
            <Text style={[styles.year, { color: secondaryColor }]}>Ano {ano}</Text>
          )}
          <Text style={styles.price}>{formatMoney(anuncio.preco)}</Text>

          {/* Localização */}
          {location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color={Colors.primary} />
              <Text style={[styles.locationText, { color: secondaryColor }]}>{location}</Text>
            </View>
          )}

          {/* Especificações */}
          <View style={[styles.specsCard, { backgroundColor: surfaceColor, borderColor }]}>
            <Text style={[styles.specsTitle, { color: textColor }]}>Especificações</Text>
            <View style={styles.specsGrid}>
              {anuncio.carroceria && (
                <SpecItem icon="car-outline" label="Carroceria" value={anuncio.carroceria} isDark={isDark} />
              )}
              {anuncio.tracao && (
                <SpecItem icon="settings-outline" label="Tração" value={anuncio.tracao} isDark={isDark} />
              )}
              {anuncio.motor && (
                <SpecItem icon="speedometer-outline" label="Motor" value={anuncio.motor} isDark={isDark} />
              )}
              {anuncio.cambio && (
                <SpecItem icon="git-branch-outline" label="Câmbio" value={anuncio.cambio} isDark={isDark} />
              )}
              {anuncio.km && (
                <SpecItem icon="navigate-outline" label="Quilometragem" value={`${anuncio.km.toLocaleString('pt-BR')} km`} isDark={isDark} />
              )}
              {ano && (
                <SpecItem icon="calendar-outline" label="Ano" value={String(ano)} isDark={isDark} />
              )}
            </View>
          </View>

          {/* Descrição */}
          {anuncio.descricao && (
            <View style={[styles.descCard, { backgroundColor: surfaceColor, borderColor }]}>
              <Text style={[styles.descTitle, { color: textColor }]}>Descrição</Text>
              <Text style={[styles.descText, { color: secondaryColor }]}>{anuncio.descricao}</Text>
            </View>
          )}

          {/* Views */}
          {anuncio.views && anuncio.views > 0 && (
            <View style={styles.viewsRow}>
              <Ionicons name="eye-outline" size={14} color={isDark ? Colors.textMutedDark : Colors.textMuted} />
              <Text style={[styles.viewsText, { color: isDark ? Colors.textMutedDark : Colors.textMuted }]}>
                {anuncio.views.toLocaleString('pt-BR')} visualizações
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Barra de ações fixa ───────────────────────────────────────── */}
      <View
        style={[
          styles.actionBar,
          {
            backgroundColor: surfaceColor,
            borderTopColor: borderColor,
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.actionBtnSecondary, { borderColor }]}
          onPress={handleFavorite}
          activeOpacity={0.85}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? Colors.error : (isDark ? Colors.textDark : Colors.text)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtnWhatsApp}
          onPress={handleWhatsApp}
          activeOpacity={0.85}
        >
          <Ionicons name="logo-whatsapp" size={22} color={Colors.textInverse} />
          <Text style={styles.actionBtnWhatsAppText}>Contato pelo WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.base },
  notFoundText: { fontSize: Typography.lg, fontWeight: Typography.semibold },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  backButtonText: { color: Colors.textInverse, fontWeight: Typography.bold },

  // Gallery
  galleryContainer: { position: 'relative' },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: 300,
    backgroundColor: Colors.surfaceSecondary,
  },
  galleryPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  imageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  imageDotActive: {
    width: 18,
    backgroundColor: Colors.textInverse,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  imageCounterText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
  },
  floatBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatBtnBack: {
    position: 'absolute',
    left: Spacing.base,
  },
  floatBtnGroup: {
    position: 'absolute',
    right: Spacing.base,
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  // Content
  content: {
    padding: Spacing.base,
    gap: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  destaqueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.goldSoft,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  destaqueBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.warning,
  },
  marcaBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  marcaBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
  },
  title: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.black,
    lineHeight: 32,
  },
  year: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  price: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.black,
    color: Colors.primary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  locationText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },

  // Specs
  specsCard: {
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    padding: Spacing.base,
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  specsTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    minWidth: '47%',
    flex: 1,
  },
  specContent: { flex: 1 },
  specLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    marginBottom: 2,
  },
  specValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },

  // Description
  descCard: {
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  descTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  descText: {
    fontSize: Typography.base,
    lineHeight: 24,
  },

  viewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
  },
  viewsText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
  },

  // Action bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  actionBtnSecondary: {
    width: 52,
    height: 52,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnWhatsApp: {
    flex: 1,
    height: 52,
    borderRadius: Radius.xl,
    backgroundColor: Colors.whatsapp,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  actionBtnWhatsAppText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
  },
});
