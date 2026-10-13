import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { useMobileCart } from '../../store/useMobileCart';

export default function TabsLayout() {
  const items = useMobileCart((state) => state.items);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFEFA' },
        headerTintColor: '#231709',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarStyle: {
          backgroundColor: '#FFFEFA',
          borderTopColor: '#EBE0D2',
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#C86D51',
        tabBarInactiveTintColor: '#8D6E63',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Kittu Cafe • Dausa',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          headerTitle: 'Digital Cafe Menu',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>☕</Text>,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          headerTitle: 'Your Order Cart',
          tabBarBadge: totalCount > 0 ? totalCount : undefined,
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>🛍️</Text>,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          headerTitle: 'Your Orders',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>📋</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'About & Account',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
