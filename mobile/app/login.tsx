import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/lib/supabase';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';

type Mode = 'login' | 'signup' | 'forgot';

export default function LoginScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const bg = isDark ? Colors.backgroundDark : Colors.background;
  const surfaceColor = isDark ? Colors.surfaceDark : Colors.surface;
  const textColor = isDark ? Colors.textDark : Colors.text;
  const secondaryColor = isDark ? Colors.textSecondaryDark : Colors.textSecondary;
  const borderColor = isDark ? Colors.borderDark : Colors.border;
  const inputBg = isDark ? Colors.surfaceSecondaryDark : Colors.surfaceSecondary;

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu e-mail');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.back();
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        Alert.alert('Conta criada!', 'Verifique seu e-mail para confirmar o cadastro.');
        setMode('login');
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        Alert.alert('E-mail enviado', 'Verifique sua caixa de entrada para redefinir a senha.');
        setMode('login');
      }
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const titles: Record<Mode, string> = {
    login: 'Entrar',
    signup: 'Criar conta',
    forgot: 'Recuperar senha',
  };

  const subtitles: Record<Mode, string> = {
    login: 'Acesse sua conta para gerenciar anúncios e favoritos',
    signup: 'Crie sua conta gratuitamente',
    forgot: 'Informe seu e-mail para receber o link de recuperação',
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Close button */}
        <TouchableOpacity
          style={[styles.closeBtn, { backgroundColor: isDark ? Colors.surfaceSecondaryDark : Colors.surfaceSecondary }]}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={22} color={textColor} />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoSection}>
          <Text style={styles.logoEmoji}>🚛</Text>
          <Text style={[styles.logoTitle, { color: textColor }]}>Caminhões</Text>
          <Text style={[styles.logoSub, { color: secondaryColor }]}>à Venda</Text>
        </View>

        {/* Card */}
        <View style={[styles.card, { backgroundColor: surfaceColor, borderColor }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>{titles[mode]}</Text>
          <Text style={[styles.cardSubtitle, { color: secondaryColor }]}>{subtitles[mode]}</Text>

          <View style={styles.form}>
            {mode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: textColor }]}>Nome completo</Text>
                <View style={[styles.inputContainer, { backgroundColor: inputBg, borderColor }]}>
                  <Ionicons name="person-outline" size={18} color={isDark ? Colors.textMutedDark : Colors.textMuted} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Seu nome"
                    placeholderTextColor={isDark ? Colors.textMutedDark : Colors.textMuted}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: textColor }]}>E-mail</Text>
              <View style={[styles.inputContainer, { backgroundColor: inputBg, borderColor }]}>
                <Ionicons name="mail-outline" size={18} color={isDark ? Colors.textMutedDark : Colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="seu@email.com"
                  placeholderTextColor={isDark ? Colors.textMutedDark : Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {mode !== 'forgot' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: textColor }]}>Senha</Text>
                <View style={[styles.inputContainer, { backgroundColor: inputBg, borderColor }]}>
                  <Ionicons name="lock-closed-outline" size={18} color={isDark ? Colors.textMutedDark : Colors.textMuted} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={isDark ? Colors.textMutedDark : Colors.textMuted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={isDark ? Colors.textMutedDark : Colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {mode === 'login' && (
              <TouchableOpacity onPress={() => setMode('forgot')} style={styles.forgotLink}>
                <Text style={styles.forgotLinkText}>Esqueci minha senha</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={Colors.textInverse} />
              ) : (
                <Text style={styles.submitBtnText}>{titles[mode]}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Toggle mode */}
        <View style={styles.toggleRow}>
          {mode === 'login' ? (
            <>
              <Text style={[styles.toggleText, { color: secondaryColor }]}>Não tem conta?</Text>
              <TouchableOpacity onPress={() => setMode('signup')}>
                <Text style={styles.toggleLink}>Criar conta grátis</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.toggleText, { color: secondaryColor }]}>Já tem conta?</Text>
              <TouchableOpacity onPress={() => setMode('login')}>
                <Text style={styles.toggleLink}>Entrar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.base,
    gap: Spacing.xl,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    gap: 4,
  },
  logoEmoji: { fontSize: 48 },
  logoTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.black,
    letterSpacing: -0.5,
  },
  logoSub: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  card: {
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.black,
  },
  cardSubtitle: {
    fontSize: Typography.sm,
    lineHeight: 20,
  },
  form: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  inputGroup: { gap: Spacing.xs },
  inputLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    padding: 0,
  },
  forgotLink: { alignSelf: 'flex-end' },
  forgotLinkText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  submitBtn: {
    height: 52,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  toggleText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  toggleLink: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
});
