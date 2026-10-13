import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function MobileBookTableScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 95113 17456');
  const [guests, setGuests] = useState('2');
  const [time, setTime] = useState('19:00');
  const [booked, setBooked] = useState(false);

  const handleBook = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }
    setBooked(true);
  };

  if (booked) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successBadge}>✓ CONFIRMED</Text>
        <Text style={styles.successTitle}>Table Reserved!</Text>
        <Text style={styles.successDesc}>
          We have reserved Table T1 for {guests} guests at {time} today for {name}.
        </Text>
        <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
          <Text style={styles.doneBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Dine-in Table Booking</Text>
      <Text style={styles.sub}>Kittu Cafe • Shiv Colony, Dausa</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Your Name *</Text>
        <TextInput
          placeholder="e.g. Vikram Meena"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Contact Phone *</Text>
        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Text style={styles.label}>Number of Guests *</Text>
        <View style={styles.guestRow}>
          {['1', '2', '3', '4', '6'].map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => setGuests(g)}
              style={[styles.guestBtn, guests === g ? styles.guestActive : styles.guestInactive]}
            >
              <Text
                style={[
                  styles.guestBtnText,
                  guests === g ? styles.guestTextActive : styles.guestTextInactive,
                ]}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Preferred Time Slot *</Text>
        <TextInput
          placeholder="e.g. 19:00"
          value={time}
          onChangeText={setTime}
          style={styles.input}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleBook}>
          <Text style={styles.submitBtnText}>Confirm Reservation</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6F0' },
  content: { padding: 16, gap: 10 },
  header: { fontSize: 20, fontWeight: '800', color: '#231709' },
  sub: { fontSize: 12, color: '#5D4037', marginBottom: 6 },
  card: { backgroundColor: '#FFFEFA', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#EBE0D2', gap: 12 },
  label: { fontSize: 11, fontWeight: 'bold', color: '#4E342E' },
  input: { backgroundColor: '#FAF6F0', borderWidth: 1, borderColor: '#EBE0D2', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#231709' },
  guestRow: { flexDirection: 'row', gap: 8 },
  guestBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10, borderWidth: 1 },
  guestActive: { backgroundColor: '#231709', borderColor: '#231709' },
  guestInactive: { backgroundColor: '#FAF6F0', borderColor: '#EBE0D2' },
  guestBtnText: { fontSize: 12, fontWeight: 'bold' },
  guestTextActive: { color: '#FFFFFF' },
  guestTextInactive: { color: '#4E342E' },
  submitBtn: { backgroundColor: '#231709', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  successContainer: { flex: 1, backgroundColor: '#FAF6F0', justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  successBadge: { fontSize: 12, fontWeight: 'bold', color: '#059669', letterSpacing: 1 },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#231709' },
  successDesc: { fontSize: 13, color: '#5D4037', textAlign: 'center', lineHeight: 20 },
  doneBtn: { backgroundColor: '#231709', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 12 },
  doneBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
});
