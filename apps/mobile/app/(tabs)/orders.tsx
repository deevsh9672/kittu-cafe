import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const PAST_ORDERS = [
  {
    id: 'KC-891021',
    date: 'Today, 11:20 AM',
    items: '2x Classic Cappuccino, 1x Fries',
    total: '₹310',
    status: 'In Kitchen',
  },
  {
    id: 'KC-890450',
    date: 'Yesterday, 6:40 PM',
    items: '1x Farmhouse Pizza, 1x Cold Coffee',
    total: '₹360',
    status: 'Delivered',
  },
];

export default function MobileOrdersScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Your Order History</Text>

      {PAST_ORDERS.map((order) => (
        <TouchableOpacity
          key={order.id}
          style={styles.orderCard}
          onPress={() => router.push(`/order/${order.id}` as any)}
        >
          <View style={styles.topRow}>
            <Text style={styles.orderId}>{order.id}</Text>
            <Text style={styles.orderStatus}>{order.status}</Text>
          </View>
          <Text style={styles.orderItems}>{order.items}</Text>
          <View style={styles.bottomRow}>
            <Text style={styles.orderDate}>{order.date}</Text>
            <Text style={styles.orderTotal}>{order.total}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6F0' },
  content: { padding: 14, gap: 12 },
  header: { fontSize: 16, fontWeight: 'bold', color: '#231709', marginBottom: 4 },
  orderCard: { backgroundColor: '#FFFEFA', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#EBE0D2', gap: 6 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 13, fontWeight: 'bold', color: '#231709' },
  orderStatus: { fontSize: 11, fontWeight: 'bold', color: '#C86D51', backgroundColor: '#FBECE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  orderItems: { fontSize: 11, color: '#5D4037' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopColor: '#FAF6F0', borderTopWidth: 1, paddingTop: 6 },
  orderDate: { fontSize: 10, color: '#8D6E63' },
  orderTotal: { fontSize: 13, fontWeight: '800', color: '#231709' },
});
