import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BUSINESS_CONFIG } from '../../constants/business';

const STEPS = [
  '1. Order Received by Cafe',
  '2. Confirmed & Accepted by Kitchen',
  '3. Freshly Preparing in Kitchen',
  '4. Ready for Pickup / Out for Delivery',
  '5. Completed & Delivered',
];

export default function MobileOrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleCall = () => Linking.openURL(`tel:${BUSINESS_CONFIG.contactNumber}`);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.statusCard}>
        <Text style={styles.badge}>● LIVE ORDER STATUS</Text>
        <Text style={styles.title}>Preparing Fresh to Order</Text>
        <Text style={styles.orderId}>Ticket: {id || 'KC-104921'}</Text>
        <Text style={styles.eta}>Estimated Time: 15–20 minutes at Kittu Cafe, Dausa</Text>

        <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
          <Text style={styles.callBtnText}>📞 Call Cafe ({BUSINESS_CONFIG.contactNumber})</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardHeader}>Progress Timeline</Text>
        {STEPS.map((step, idx) => (
          <View key={idx} style={styles.stepRow}>
            <View style={[styles.stepCircle, idx <= 2 ? styles.circleActive : styles.circleInactive]}>
              <Text style={styles.circleText}>{idx + 1}</Text>
            </View>
            <Text style={[styles.stepText, idx <= 2 ? styles.textActive : styles.textInactive]}>
              {step}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/(tabs)/menu')}>
        <Text style={styles.backBtnText}>← Back to Digital Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6F0' },
  content: { padding: 14, gap: 12, paddingBottom: 40 },
  statusCard: { backgroundColor: '#231709', padding: 18, borderRadius: 20, gap: 6 },
  badge: { fontSize: 10, fontWeight: 'bold', color: '#D97736', letterSpacing: 1 },
  title: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  orderId: { fontSize: 12, fontFamily: 'monospace', color: '#DFCDB8' },
  eta: { fontSize: 11, color: '#DFCDB8', marginTop: 4 },
  callBtn: { backgroundColor: '#D97736', paddingVertical: 8, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  callBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 11 },
  card: { backgroundColor: '#FFFEFA', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#EBE0D2', gap: 12 },
  cardHeader: { fontSize: 13, fontWeight: 'bold', color: '#231709', borderBottomColor: '#FAF6F0', borderBottomWidth: 1, paddingBottom: 6 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepCircle: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  circleActive: { backgroundColor: '#D97736' },
  circleInactive: { backgroundColor: '#FAF6F0', borderWidth: 1, borderColor: '#EBE0D2' },
  circleText: { fontSize: 11, fontWeight: 'bold', color: '#FFFFFF' },
  stepText: { fontSize: 12, flex: 1 },
  textActive: { color: '#231709', fontWeight: 'bold' },
  textInactive: { color: '#8D6E63' },
  backBtn: { paddingVertical: 12, alignItems: 'center' },
  backBtnText: { fontSize: 12, fontWeight: 'bold', color: '#C86D51' },
});
