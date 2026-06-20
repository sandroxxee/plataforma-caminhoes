import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, Radius, Shadows, formatMoney, getLocation, getTruckImage, getAnuncioTitle } from '@/lib/theme';
import type { Anuncio } from '@/types/anuncio';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.base * 2 - Spacing.sm) / 2;

type AdCardProps = {
  anuncio: Anuncio;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
  variant?: 'grid' | 'list' | 'featured';
};

export function AdCard({ anuncio, onFavorite, isFavorite = false, variant = 'grid' }: AdCardProps) {
  const isDark = useColorScheme() === 'dark';
  const image = getTruckImage(anuncio.truck_images);
  const title = getAnuncioTitle(anuncio.titulo, anuncio.marca, anuncio.modelo);
  const location = getLocation(anuncio.cidade, anuncio.estado);
  const price = formatMoney(anuncio.preco);
  const ano = anuncio.ano_modelo || anuncio.ano_fabricacao;

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/anuncio/${anuncio.id}`);
  }, [anuncio.id]);

  const handleFavorite = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onFavorite?.(anuncio.id);
  }, [anuncio.id, onFavorite]);

  if (variant === 'list') {
    return (
      <TouchableOpacity
        style={[styles.listCard, isDark && styles.listCardDark]}
        onPress={handlePress}
        activeOpacity={0.92}
      >
        <Image
          source={image || require('@/assets/images/truck-placeholder.png')}
          style={styles.listImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.listContent}>
          <View style={styles.listHeader}>
            {anuncio.destaque && (
              <View style={styles.destaqueBadge}>
                <Text style={styles.destaqueBadgeText}>Destaque</Text>
              </View>
            )}
            <TouchableOpacity onPress={handleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? Colors.error : (isDark ? Colors.textMutedDark : Colors.textMuted)}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.listTitle, isDark && styles.textDark]} numberOfLines={2}>
            {title}
          </Text>
          {ano && (
            <Text style={[styles.listYear, isDark && styles.textMutedDark]}>
              {ano}
            </Text>
          )}
          <Text style={styles.listPrice}>{price}</Text>
          {location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={12} color={isDark ? Colors.textMutedDark : Colors.textMuted} />
              <Text style={[styles.locationText, isDark && styles.textMutedDark]} numberOfLines={1}>
                {location}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'featured') {
    return (
      <TouchableOpacity
        style={[styles.featuredCard, isDark && styles.featuredCardDark]}
        onPress={handlePress}
        activeOpacity={0.92}
      >
        <Image
          source={image || require('@/assets/images/truck-placeholder.png')}
          style={styles.featuredImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.featuredOverlay}>
          <View style={styles.featuredBadgeRow}>
            <View style={styles.destaqueBadge}>
              <Ionicons name="star" size={10} color={Colors.gold} />
              <Text style={styles.destaqueBadgeText}>Destaque</Text>
            </View>
            <TouchableOpacity onPress={handleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <View style={styles.favButton}>
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={16}
                  color={isFavorite ? Colors.error : Colors.textInverse}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.featuredInfo}>
            <Text style={styles.featuredTitle} numberOfLines={2}>{title}</Text>
            <Text style={styles.featuredPrice}>{price}</Text>
            {location && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={styles.featuredLocation} numberOfLines={1}>{location}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Grid variant (default)
  return (
    <TouchableOpacity
      style={[styles.gridCard, isDark && styles.gridCardDark, { width: CARD_WIDTH }]}
      onPress={handlePress}
      activeOpacity={0.92}
    >
      <View style={styles.imageContainer}>
        <Image
          source={image || require('@/assets/images/truck-placeholder.png')}
          style={styles.gridImage}
          contentFit="cover"
          transition={200}
        />
        {anuncio.destaque && (
          <View style={styles.gridDestaqueBadge}>
            <Ionicons name="star" size={9} color={Colors.gold} />
          </View>
        )}
        <TouchableOpacity
          style={styles.gridFavButton}
          onPress={handleFavorite}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={16}
            color={isFavorite ? Colors.error : Colors.textInverse}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.gridContent}>
        <Text style={[styles.gridTitle, isDark && styles.textDark]} numberOfLines={2}>
          {title}
        </Text>
        {ano && (
          <Text style={[styles.gridYear, isDark && styles.textMutedDark]}>{ano}</Text>
        )}
        <Text style={styles.gridPrice}>{price}</Text>
        {location && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={11} color={isDark ? Colors.textMutedDark : Colors.textMuted} />
            <Text style={[styles.locationText, isDark && styles.textMutedDark]} numberOfLines={1}>
              {location}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // ── Grid ──────────────────────────────────────────────────────────────────
  gridCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  gridCardDark: {
    backgroundColor: Colors.surfaceDark,
    borderColor: Colors.borderDark,
  },
  imageContainer: {
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: 130,
    backgroundColor: Colors.surfaceSecondary,
  },
  gridDestaqueBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridFavButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContent: {
    padding: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  gridTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.text,
    lineHeight: 18,
    marginBottom: 2,
  },
  gridYear: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    fontWeight: Typography.medium,
    marginBottom: 4,
  },
  gridPrice: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: 4,
  },

  // ── List ──────────────────────────────────────────────────────────────────
  listCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  listCardDark: {
    backgroundColor: Colors.surfaceDark,
    borderColor: Colors.borderDark,
  },
  listImage: {
    width: 120,
    height: 110,
    backgroundColor: Colors.surfaceSecondary,
  },
  listContent: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  listTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.text,
    lineHeight: 18,
    flex: 1,
    marginRight: Spacing.sm,
  },
  listYear: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    fontWeight: Typography.medium,
    marginBottom: 4,
  },
  listPrice: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: 4,
  },

  // ── Featured ──────────────────────────────────────────────────────────────
  featuredCard: {
    width: SCREEN_WIDTH - Spacing.base * 2,
    height: 220,
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
    marginRight: Spacing.md,
    ...Shadows.lg,
  },
  featuredCardDark: {
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceSecondary,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    background: 'transparent',
    justifyContent: 'space-between',
    padding: Spacing.base,
    backgroundColor: 'transparent',
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredInfo: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  featuredTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
    lineHeight: 22,
    marginBottom: 4,
  },
  featuredPrice: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.black,
    color: Colors.textInverse,
    marginBottom: 4,
  },
  featuredLocation: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.75)',
    marginLeft: 4,
  },
  favButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Shared ────────────────────────────────────────────────────────────────
  destaqueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.goldSoft,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  destaqueBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.warning,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    flex: 1,
  },
  textDark: {
    color: Colors.textDark,
  },
  textMutedDark: {
    color: Colors.textMutedDark,
  },
});
