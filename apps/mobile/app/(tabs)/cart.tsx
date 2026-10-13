import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMobileCart } from '../../store/useMobileCart';

export default function MobileCartScreen() {
  const router = useRouter();
  const {
    items,
    orderType,
    customerName,
    customerPhone,
    deliveryAddress,
    discountInPaise,
    appliedCoupon,
    updateQuantity,
    clearCart,
    setOrderType,
    setCustomerInfo,
    setAppliedCoupon,
    subtotalInPaise,
  } = useMobileCart();

  const [name, setName] = useState(customerName);
  const [phone, setPhone] = useState(customerPhone);
  const [address, setAddress] = useState(deliveryAddress);

  const subtotal = subtotalInPaise();
  const deliveryFee = orderType === 'delivery' ? (subtotal >= 49900 ? 0 : 4000) : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = Math.max(0, subtotal + tax + deliveryFee - discountInPaise);

  const handleApplyKittu50 = () => {
    const discount = Math.min(Math.round(subtotal * 0.5), 10000);
    setAppliedCoupon('KITTU50', discount);
    Alert.alert('Coupon Applied', '50% discount up to ₹100 applied!');
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setCustomerInfo(name, phone, address);
    const mockId = `KC-${Date.now().toString().slice(-6)}`;
    clearCart();
    router.push(`/order/${mockId}` as any);
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySub}>Add coffee or snacks from the menu to proceed.</Text>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() => router.push('/(tabs)/menu')}
        >
          <Text style={styles.browseBtnText}>Browse Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Type Switcher */}
      <View style={styles.typeSwitcher}>
        {(['delivery', 'pickup', 'dine_in'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setOrderType(type)}
            style={[
              styles.typeTab,
              orderType === type ? styles.typeTabActive : styles.typeTabInactive,
            ]}
          >
            <Text
              style={[
                styles.typeTabText,
                orderType === type ? styles.typeTabTextActive : styles.typeTabTextInactive,
              ]}
            >
              {type === 'delivery' ? 'Delivery' : type === 'pickup' ? 'Takeaway' : 'Dine-in'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cart Items */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Selected Dishes</Text>
        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                ₹{((item.unitPriceInPaise * item.quantity) / 100).toFixed(0)}
              </Text>
            </View>

            <View style={styles.stepper}>
              <TouchableOpacity
                onPress={() => updateQuantity(item.id, -1)}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.stepQty}>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => updateQuantity(item.id, 1)}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Customer Contact */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Customer Details</Text>
        <TextInput
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />
        {orderType === 'delivery' && (
          <TextInput
            placeholder="Delivery Address in Dausa"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />
        )}
      </View>

      {/* Coupon promo */}
      {!appliedCoupon && (
        <TouchableOpacity style={styles.couponCard} onPress={handleApplyKittu50}>
          <Text style={styles.couponTitle}>🏷️ Apply Coupon KITTU50</Text>
          <Text style={styles.couponSub}>Tap here to save 50% up to ₹100</Text>
        </TouchableOpacity>
      )}

      {/* Bill summary */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Bill Details</Text>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Item Subtotal</Text>
          <Text style={styles.billVal}>₹{(subtotal / 100).toFixed(0)}</Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>GST (5%)</Text>
          <Text style={styles.billVal}>₹{(tax / 100).toFixed(0)}</Text>
        </View>
        {orderType === 'delivery' && (
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billVal}>
              {deliveryFee === 0 ? 'FREE' : `₹${(deliveryFee / 100).toFixed(0)}`}
            </Text>
          </View>
        )}
        {discountInPaise > 0 && (
          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: '#059669', fontWeight: 'bold' }]}>
              Coupon Discount
            </Text>
            <Text style={[styles.billVal, { color: '#059669', fontWeight: 'bold' }]}>
              -₹{(discountInPaise / 100).toFixed(0)}
            </Text>
          </View>
        )}
        <View style={[styles.billRow, styles.billTotalRow]}>
          <Text style={styles.totalLabel}>To Pay</Text>
          <Text style={styles.totalVal}>₹{(total / 100).toFixed(0)}</Text>
        </View>
      </View>

      {/* Place Order CTA */}
      <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
        <Text style={styles.checkoutBtnText}>
          Place Order • ₹{(total / 100).toFixed(0)}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6F0' },
  content: { padding: 14, gap: 12, paddingBottom: 40 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#231709' },
  emptySub: { fontSize: 12, color: '#5D4037', textAlign: 'center' },
  browseBtn: { backgroundColor: '#231709', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginTop: 10 },
  browseBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  typeSwitcher: { flexDirection: 'row', backgroundColor: '#FFFEFA', borderRadius: 14, padding: 4, borderWidth: 1, borderColor: '#EBE0D2' },
  typeTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  typeTabActive: { backgroundColor: '#231709' },
  typeTabInactive: { backgroundColor: 'transparent' },
  typeTabText: { fontSize: 11, fontWeight: 'bold' },
  typeTabTextActive: { color: '#FFFFFF' },
  typeTabTextInactive: { color: '#5D4037' },
  card: { backgroundColor: '#FFFEFA', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#EBE0D2', gap: 10 },
  cardHeader: { fontSize: 13, fontWeight: 'bold', color: '#231709', borderBottomColor: '#FAF6F0', borderBottomWidth: 1, paddingBottom: 6 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 12, fontWeight: 'bold', color: '#231709' },
  itemPrice: { fontSize: 11, color: '#5D4037', marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EBE0D2', borderRadius: 10, backgroundColor: '#FAF6F0' },
  stepBtn: { paddingHorizontal: 10, paddingVertical: 4 },
  stepBtnText: { fontSize: 14, fontWeight: 'bold', color: '#231709' },
  stepQty: { fontSize: 12, fontWeight: 'bold', color: '#231709', paddingHorizontal: 6 },
  input: { backgroundColor: '#FAF6F0', borderWidth: 1, borderColor: '#EBE0D2', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 12, color: '#231709' },
  couponCard: { backgroundColor: '#FBECE7', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#E6866B', gap: 2 },
  couponTitle: { fontSize: 12, fontWeight: 'bold', color: '#C86D51' },
  couponSub: { fontSize: 10, color: '#5D4037' },
  billRow: { flexDirection: 'row', justifyContent: 'space-between' },
  billLabel: { fontSize: 11, color: '#5D4037' },
  billVal: { fontSize: 11, color: '#231709', fontWeight: 'bold' },
  billTotalRow: { borderTopColor: '#FAF6F0', borderTopWidth: 1, paddingTop: 8, marginTop: 4 },
  totalLabel: { fontSize: 14, fontWeight: '800', color: '#231709' },
  totalVal: { fontSize: 16, fontWeight: '800', color: '#C86D51' },
  checkoutBtn: { backgroundColor: '#231709', paddingVertical: 14, borderRadius: 14, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  checkoutBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
});
