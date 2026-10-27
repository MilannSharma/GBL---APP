import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
interface TabRoute {
  key: string;
  name: string;
}

interface TabRoute {
  key: string;
  name: string;
}

interface FloatingTabBarProps {
  state: {
    index: number;
    routes: TabRoute[];
  };
  navigateToTab?: (routeKey: string) => void;
  [key: string]: unknown;
}

function FloatingTabBar({ state, navigateToTab }: FloatingTabBarProps) {
  const router = useRouter();

  // Mapping tab routes to label and icons
  const getTabConfig = (routeName: string, isFocused: boolean) => {
    switch (routeName) {
      case 'index':
        return {
          label: 'Home',
          renderIcon: () =>
            isFocused ? (
              <View style={styles.activeIconCircle}>
                <Ionicons name="home" size={17} color="#FFFFFF" />
              </View>
            ) : (
              <Ionicons name="home-outline" size={20} color="#94A3B8" />
            ),
        };
      case 'visits':
        return {
          label: 'Visits',
          renderIcon: () => (
            <Feather
              name="calendar"
              size={20}
              color={isFocused ? '#0E70E3' : '#94A3B8'}
            />
          ),
        };
      case 'profile':
        return {
          label: 'Profile',
          renderIcon: () => (
            <Feather
              name="user"
              size={20}
              color={isFocused ? '#0E70E3' : '#94A3B8'}
            />
          ),
        };
      case 'history':
        return {
          label: 'More',
          renderIcon: () => (
            <Feather
              name="more-horizontal"
              size={20}
              color={isFocused ? '#0E70E3' : '#94A3B8'}
            />
          ),
        };
      default:
        return {
          label: routeName,
          renderIcon: () => <Feather name="circle" size={20} color="#94A3B8" />,
        };
    }
  };

  const handleCenterFabPress = () => {
    router.push('/(tabs)/visits');
  };

  // Split tabs around center button
  const leftRoutes = state.routes.slice(0, 2); // index (Home), visits (Visits)
  const rightRoutes = state.routes.slice(2, 4); // profile (Profile), history (More)

  return (
    <View style={styles.tabBarContainer}>
      {/* Left Routes: Home & Visits */}
      {leftRoutes.map((route: TabRoute, index: number) => {
        const isFocused = state.index === index;
        const { label, renderIcon } = getTabConfig(route.name, isFocused);

        const onPress = () => {
          if (navigateToTab) {
            navigateToTab(route.key);
          } else {
            router.push(`/(tabs)/${route.name === 'index' ? '' : route.name}` as any);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            accessibilityRole="tab"
            accessibilityLabel={label}
            activeOpacity={0.7}
          >
            {renderIcon()}
            <Text
              style={[
                styles.tabLabel,
                isFocused ? styles.activeTabLabel : styles.inactiveTabLabel,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* Center Floating Action Button (FAB) */}
      <View style={styles.fabWrapper}>
        <TouchableOpacity
          style={styles.centerFab}
          onPress={handleCenterFabPress}
          accessibilityRole="button"
          accessibilityLabel="Quick Check-in route"
          activeOpacity={0.85}
        >
          <Ionicons name="git-network-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Right Routes: Profile & More */}
      {rightRoutes.map((route: TabRoute, idx: number) => {
        const actualIndex = idx + 2;
        const isFocused = state.index === actualIndex;
        const { label, renderIcon } = getTabConfig(route.name, isFocused);

        const onPress = () => {
          if (navigateToTab) {
            navigateToTab(route.key);
          } else {
            router.push(`/(tabs)/${route.name === 'index' ? '' : route.name}` as any);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            accessibilityRole="tab"
            accessibilityLabel={label}
            activeOpacity={0.7}
          >
            {renderIcon()}
            <Text
              style={[
                styles.tabLabel,
                isFocused ? styles.activeTabLabel : styles.inactiveTabLabel,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: 'Visits',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'More',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.OS === 'ios' ? 24 : 14,
    height: 68,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#EDF4FC',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0E70E3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#0E70E3',
    fontWeight: '700',
  },
  inactiveTabLabel: {
    color: '#94A3B8',
  },
  fabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  centerFab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0E70E3',
    alignItems: 'center',
    justifyContent: 'center',
    top: -14,
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
