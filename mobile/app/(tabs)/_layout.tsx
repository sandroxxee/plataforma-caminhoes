import { Tabs } from 'expo-router';
import { useColorScheme, Platform, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/lib/theme';

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  isDark: boolean;
};

function TabIcon({ name, focused, isDark }: TabIconProps) {
  const activeColor = Colors.primary;
  const inactiveColor = isDark ? Colors.textMutedDark : Colors.textMuted;

  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <Ionicons
        name={focused ? name : (`${name}-outline` as keyof typeof Ionicons.glyphMap)}
        size={24}
        color={focused ? activeColor : inactiveColor}
      />
    </View>
  );
}

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const tabBarBackground = isDark
    ? 'rgba(15,23,42,0.95)'
    : 'rgba(255,255,255,0.95)';

  const borderColor = isDark ? Colors.borderDark : Colors.border;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: isDark ? Colors.textMutedDark : Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 1,
          borderTopColor: borderColor,
          backgroundColor: tabBarBackground,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} isDark={isDark} />
          ),
        }}
      />
      <Tabs.Screen
        name="buscar"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="search" focused={focused} isDark={isDark} />
          ),
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="heart" focused={focused} isDark={isDark} />
          ),
        }}
      />
      <Tabs.Screen
        name="anuncios"
        options={{
          title: 'Anunciar',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="add-circle" focused={focused} isDark={isDark} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person" focused={focused} isDark={isDark} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  iconContainerActive: {
    backgroundColor: Colors.primarySoft,
  },
});
