import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';

type PlanCardProps = {
  emoji: string;
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  onPress: () => void;
};

function PlanCard({ emoji, title, price, features, highlighted = false, onPress }: PlanCardProps) {
  const isDark = useColorScheme() === 'dark';
  const surfaceColor = isDark ? Colors.surfaceDark : Colors.surface;
  const textColor = isDark ? Colors.textDark : Colors.text;
  const borderColor = isDark ? Colors.borderDark : Colors.border;

  return (
    <TouchableOpacity
      style={[
        styles.planCard,
        { backgroundColor: highlighted ? Colors.primary : surfaceColor },
        !highlighted && { borderColor, borderWidth: 1 },
        ...Shadows.md as any[],
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      activeOpacity={0.9}
    >
      {highlighted && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>Mais popular</Text>
        </View>
      )}
      <Text style={styles.planEmoji}>{emoji}</Text>
      <Text style={[styles.planTitle, { color: highlighted ? Colors.textInverse : textColor }]}>
        {title}
      </Text>
      <Text style={[styles.planPrice, { color: highlighted ? Colors.textInverse : Colors.primary }]}>
        {price}
      </Text>
      <View style={styles.planFeatures}>
        {features.map((f, i) => (
          <View key={i} style={styles.planFeatureRow}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={highlighted ? 'rgba(255,255,255,0.85)' : Colors.success}
            />
            <Text style={[
              styles.planFeatureText,
              { color: highlighted ? 'rgba(255,255,255,0.9)' : (isDark ? Colors.textSecondaryDark : Colors.textSecondary) }
            ]}>
              {f}
            </Text>
          </View>
        ))}
      </View>
      <View style={[
        styles.planButton,
        { backgroundColor: highlighted ? 'rgba(255,255,255,0.2)' : Colors.primarySoft }
      ]}>
        <Text style={[styles.planButtonText, { color: highlighted ? Colors.textInverse : Colors.primary }]}>
          Começar agora
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function AnunciosScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  const bg = isDark ? Colors.backgroundDark : Colors.background;
  const surfaceColor = isDark ? Colors.surfaceDark : Colors.surface;
  const textColor = isDark ? Colors.textDark : Colors.text;
  const secondaryColor = isDark ? Colors.textSecondaryDark : Colors.textSecondary;
  const borderColor = isDark ? Colors.borderDark : Colors.border;

  const handleAnunciarGratis = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL('https://caminhoes.app/anunciar-gratis');
  };

  const handleWhatsApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://wa.me/5549999999999?text=Quero%20anunciar%20meu%20caminhão');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: bg }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Anunciar</Text>
        <Text style={[styles.headerSub, { color: secondaryColor }]}>
          Alcance milhares de compradores
        </Text>
      </View>

      {/* Hero */}
      <View style={[styles.heroBanner, { backgroundColor: Colors.primary }]}>
        <Text style={styles.heroEmoji}>🚛</Text>
        <Text style={styles.heroTitle}>Venda mais rápido</Text>
        <Text style={styles.heroDesc}>
          Anuncie seu caminhão e receba contatos direto pelo WhatsApp
        </Text>
        <TouchableOpacity
          style={styles.heroBtn}
          onPress={handleAnunciarGratis}
          activeOpacity={0.85}
        >
          <Text style={styles.heroBtnText}>Anunciar grátis agora</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Como funciona */}
      <View style={[styles.section, { paddingHorizontal: Spacing.base }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Como funciona</Text>
        {[
          { step: '1', icon: 'camera-outline', title: 'Tire fotos', desc: 'Fotografe seu veículo com boa iluminação' },
          { step: '2', icon: 'create-outline', title: 'Preencha os dados', desc: 'Modelo, ano, km, preço e contato' },
          { step: '3', icon: 'checkmark-circle-outline', title: 'Publique', desc: 'Seu anúncio é revisado e publicado em minutos' },
          { step: '4', icon: 'logo-whatsapp', title: 'Receba contatos', desc: 'Compradores falam direto com você pelo WhatsApp' },
        ].map((item) => (
          <View key={item.step} style={[styles.stepCard, { backgroundColor: surfaceColor, borderColor }]}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{item.step}</Text>
            </View>
            <View style={[styles.stepIcon, { backgroundColor: Colors.primarySoft }]}>
              <Ionicons name={item.icon as any} size={22} color={Colors.primary} />
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: textColor }]}>{item.title}</Text>
              <Text style={[styles.stepDesc, { color: secondaryColor }]}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Planos */}
      <View style={[styles.section, { paddingHorizontal: Spacing.base }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Planos</Text>
        <PlanCard
          emoji="🆓"
          title="Gratuito"
          price="R$ 0"
          features={['1 anúncio ativo', 'Fotos básicas', 'Contato por WhatsApp', 'Validade 30 dias']}
          onPress={handleAnunciarGratis}
        />
        <PlanCard
          emoji="⭐"
          title="Destaque"
          price="R$ 49/mês"
          features={['Anúncios ilimitados', 'Posição de destaque', 'Galeria com até 20 fotos', 'Validade 60 dias', 'Badge verificado']}
          highlighted
          onPress={handleAnunciarGratis}
        />
        <PlanCard
          emoji="🏢"
          title="Revenda"
          price="R$ 199/mês"
          features={['Estoque completo', 'Página da revenda', 'Relatórios de visualizações', 'Suporte prioritário', 'Integração WhatsApp Business']}
          onPress={handleAnunciarGratis}
        />
      </View>

      {/* CTA WhatsApp */}
      <TouchableOpacity
        style={[styles.waBanner, { backgroundColor: Colors.whatsappSoft, borderColor: Colors.whatsapp }]}
        onPress={handleWhatsApp}
        activeOpacity={0.85}
      >
        <Ionicons name="logo-whatsapp" size={28} color={Colors.whatsapp} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.waTitle, { color: textColor }]}>Falar com a equipe</Text>
          <Text style={[styles.waDesc, { color: secondaryColor }]}>
            Dúvidas? Fale com a gente pelo WhatsApp
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.whatsapp} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    gap: 4,
  },
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.black,
  },
  headerSub: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },

  heroBanner: {
    marginHorizontal: Spacing.base,
    borderRadius: Radius['2xl'],
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  heroEmoji: { fontSize: 48 },
  heroTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.black,
    color: Colors.textInverse,
    textAlign: 'center',
  },
  heroDesc: {
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
  },
  heroBtnText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },

  section: { marginTop: Spacing.xl, gap: Spacing.md },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    marginBottom: Spacing.sm,
  },

  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.base,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: Typography.sm,
    fontWeight: Typography.black,
    color: Colors.primary,
  },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: { flex: 1 },
  stepTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: Typography.sm,
    lineHeight: 18,
  },

  planCard: {
    borderRadius: Radius['2xl'],
    padding: Spacing.xl,
    gap: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  popularBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
  },
  planEmoji: { fontSize: 32 },
  planTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
  planPrice: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.black,
  },
  planFeatures: { gap: Spacing.sm },
  planFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  planFeatureText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    flex: 1,
  },
  planButton: {
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  planButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },

  waBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.xl,
    borderRadius: Radius['2xl'],
    borderWidth: 1.5,
    padding: Spacing.base,
  },
  waTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    marginBottom: 2,
  },
  waDesc: {
    fontSize: Typography.sm,
  },
});
