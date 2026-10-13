import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { BUSINESS_CONFIG } from '../../constants/business';

export default function MobileProfileScreen() {
  const handleCall = () => Linking.openURL(`tel:${BUSINESS_CONFIG.contactNumber}`);
  const handleDirections = () => Linking.openURL(BUSINESS_CONFIG.mapsUrl);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Account Info */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>KC</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Guest Customer</Text>
          <Text style={styles.phone}>Phone OTP verified account</Text>
        </View>
      </View>

      {/* Verified Cafe Profile */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>About Kittu Cafe</Text>
        <Text style={styles.infoRow}>📍 {BUSINESS_CONFIG.address}</Text>
        <Text style={styles.infoRow}>🕒 Hours: 10:00 AM – 10:30 PM</Text>
        <Text style={styles.infoRow}>📞 Contact: {BUSINESS_CONFIG.contactNumber}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCall}>
            <Text style={styles.actionBtnText}>Call Cafe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnOutline} onPress={handleDirections}>
            <Text style={styles.actionBtnOutlineText}>Google Maps Directions</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Compliance & App Info */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>App Information</Text>
        <Text style={styles.textSmall}>Kittu Cafe Mobile App v1.0.0 (Production)</Text>
        <Text style={styles.textSmall}>Dausa, Rajasthan, India</Text>
        <Text style={styles.textSmall}>GST & FSSAI Compliant Platform</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6F0' },
  content: { padding: 14, gap: 12 },
  profileCard: { backgroundColor: '#FFFEFA', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#EBE0D2', flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#231709', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#D97736', fontWeight: 'bold', fontSize: 16 },
  name: { fontSize: 14, fontWeight: 'bold', color: '#231709' },
  phone: { fontSize: 11, color: '#5D4037', marginTop: 2 },
  card: { backgroundColor: '#FFFEFA', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#EBE0D2', gap: 8 },
  cardHeader: { fontSize: 13, fontWeight: 'bold', color: '#231709', borderBottomColor: '#FAF6F0', borderBottomWidth: 1, paddingBottom: 6 },
  infoRow: { fontSize: 12, color: '#5D4037', lineHeight: 18 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionBtn: { flex: 1, backgroundColor: '#231709', paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  actionBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 11 },
  actionBtnOutline: { flex: 1, borderColor: '#DFCDB8', borderWidth: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  actionBtnOutlineText: { color: '#231709', fontWeight: 'bold', fontSize: 11 },
  textSmall: { fontSize: 11, color: '#8D6E63' },
});
