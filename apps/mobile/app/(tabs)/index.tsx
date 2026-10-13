import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BUSINESS_CONFIG } from '../../constants/business';
import { useMobileCart } from '../../store/useMobileCart';

const BESTSELLERS = [
  {
    id: 'm1',
    name: 'Classic Handcrafted Cappuccino',
    priceInPaise: 11000,
    category: 'Hot Coffee',
    desc: 'Rich double-shot espresso topped with velvet steamed milk froth.',
  },
  {
    id: 'm2',
    name: 'Kittu Hazelnut Cold Coffee',
    priceInPaise: 14000,
    category: 'Cold Coffee',
    desc: 'Thick blend with roasted hazelnut syrup & vanilla scoop.',
  },
  {
    id: 'm3',
    name: 'Grilled Paneer Tikka Sandwich',
    priceInPaise: 13000,
    category: 'Sandwiches',
    desc: 'Marinated paneer cubes, mint chutney, and molten cheese.',
  },
  {
    id: 'm4',
    name: 'Veg Loaded Farmhouse Pizza',
    priceInPaise: 22000,
    category: 'Pizzas',
    desc: 'Crispy stone base loaded with fresh mozzarella & sweet corn.',
  },
];

export default function MobileHomeScreen() {
  const router = useRouter();
  const addItem = useMobileCart((state) => state.addItem);

  const handleCall = () => {
    Linking.openURL(`tel:${BUSINESS_CONFIG.contactNumber}`);
  };

  const handleDirections = () => {
    Linking.openURL(BUSINESS_CONFIG.mapsUrl);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 3D Location Pill */}
      <View style={styles.locationBar}>
        <View style={{ flex: 1 }}>
          <View style={styles.liveRow}>
            <View style={styles.greenPulse} />
            <Text style={styles.locationTitle}>Shiv Colony, Dausa 303303</Text>
          </View>
          <Text style={styles.locationSub}>Open Today: 10:00 AM – 10:30 PM</Text>
        </View>
        <TouchableOpacity style={styles.callBadge} onPress={handleCall}>
          <Text style={styles.callBadgeText}>📞 Call</Text>
        </TouchableOpacity>
      </View>

      {/* 3D Luxury Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopTag}>
          <Text style={styles.heroTag}>★ 3D ARTISANAL CAFE</Text>
        </View>
        <Text style={styles.heroTitle}>Kittu Cafe</Text>
        <Text style={styles.heroSubtitle}>
          Crafted Coffee, Gourmet Sandwiches & Fresh Stone-Baked Pizzas in Dausa, Rajasthan.
        </Text>

        <View style={styles.heroActions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push('/(tabs)/menu')}
          >
            <Text style={styles.primaryBtnText}>Explore Menu →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push('/book-table')}
          >
            <Text style={styles.secondaryBtnText}>Book Table</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3D Golden Offer Card */}
      <View style={styles.promoCard}>
        <Text style={styles.promoTitle}>✨ Welcome Offer</Text>
        <Text style={styles.promoDesc}>
          Use coupon <Text style={styles.promoBold}>KITTU50</Text> for 50% discount up to ₹100!
        </Text>
      </View>

      {/* Popular Specialties Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Cafe Specials</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/menu')}>
          <Text style={styles.seeAllText}>View All →</Text>
        </TouchableOpacity>
      </View>

      {/* 3D Elevated Items List */}
      <View style={styles.itemsGrid}>
        {BESTSELLERS.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View>
              <View style={styles.categoryRow}>
                <View style={styles.vegSquare}>
                  <View style={styles.vegDot} />
                </View>
                <Text style={styles.itemCategory}>{item.category}</Text>
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.desc}</Text>
            </View>

            <View style={styles.itemFooter}>
              <Text style={styles.itemPrice}>₹{(item.priceInPaise / 100).toFixed(0)}</Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() =>
                  addItem({
                    menuItemId: item.id,
                    name: item.name,
                    unitPriceInPaise: item.priceInPaise,
                    quantity: 1,
                  })
                }
              >
                <Text style={styles.addBtnText}>+ ADD</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* 3D Location Discovery Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Visit Kittu Cafe in Dausa</Text>
        <Text style={styles.infoText}>{BUSINESS_CONFIG.address}</Text>
        <TouchableOpacity style={styles.directionsBtn} onPress={handleDirections}>
          <Text style={styles.directionsBtnText}>Open in Google Maps ↗</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6F0' },
  content: { padding: 16, paddingBottom: 40, gap: 16 },
  locationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFEFA',
    padding: 14,
    borderRadius: 20,
    borderColor: '#EBE0D2',
    borderWidth: 1,
    shadowColor: '#2B1E16',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  greenPulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  locationTitle: { fontSize: 12, fontWeight: '800', color: '#231709' },
  locationSub: { fontSize: 10, color: '#5D4037', marginTop: 2 },
  callBadge: {
    backgroundColor: '#FBECE7',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6866B',
  },
  callBadgeText: { fontSize: 11, fontWeight: '800', color: '#C86D51' },
  heroCard: {
    backgroundColor: '#1E140B',
    padding: 22,
    borderRadius: 28,
    gap: 10,
    shadowColor: '#1E140B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 54, 0.3)',
  },
  heroTopTag: { alignSelf: 'flex-start' },
  heroTag: { fontSize: 10, fontWeight: '900', color: '#D97736', letterSpacing: 1.2 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  heroSubtitle: { fontSize: 12, color: '#DFCDB8', lineHeight: 18, fontWeight: '500' },
  heroActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  primaryBtn: {
    backgroundColor: '#D97736',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#D97736',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  secondaryBtn: {
    backgroundColor: '#352115',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  secondaryBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  promoCard: {
    backgroundColor: '#FBECE7',
    padding: 15,
    borderRadius: 20,
    borderColor: '#E6866B',
    borderWidth: 1,
    gap: 3,
    shadowColor: '#C86D51',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  promoTitle: { fontSize: 12, fontWeight: '800', color: '#C86D51' },
  promoDesc: { fontSize: 11, color: '#5D4037', fontWeight: '500' },
  promoBold: { fontWeight: '900', color: '#231709' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#231709', letterSpacing: -0.3 },
  seeAllText: { fontSize: 12, fontWeight: '800', color: '#C86D51' },
  itemsGrid: { gap: 14 },
  itemCard: {
    backgroundColor: '#FFFEFA',
    padding: 16,
    borderRadius: 22,
    borderColor: '#EBE0D2',
    borderWidth: 1,
    gap: 12,
    shadowColor: '#2B1E16',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  vegSquare: { width: 12, height: 12, borderWidth: 1.5, borderColor: '#10B981', borderRadius: 2, justifyContent: 'center', alignItems: 'center' },
  vegDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  itemCategory: { fontSize: 10, fontWeight: '800', color: '#C86D51', textTransform: 'uppercase', letterSpacing: 0.5 },
  itemName: { fontSize: 15, fontWeight: '800', color: '#231709' },
  itemDesc: { fontSize: 11, color: '#5D4037', lineHeight: 16, fontWeight: '400' },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#FAF6F0',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  itemPrice: { fontSize: 16, fontWeight: '900', color: '#231709' },
  addBtn: {
    backgroundColor: '#231709',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  addBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 11 },
  infoCard: {
    backgroundColor: '#FFFEFA',
    padding: 18,
    borderRadius: 22,
    borderColor: '#EBE0D2',
    borderWidth: 1,
    gap: 6,
    shadowColor: '#2B1E16',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  infoTitle: { fontSize: 14, fontWeight: '800', color: '#231709' },
  infoText: { fontSize: 11, color: '#5D4037', lineHeight: 16 },
  directionsBtn: { marginTop: 6 },
  directionsBtnText: { fontSize: 12, fontWeight: '800', color: '#C86D51' },
});
