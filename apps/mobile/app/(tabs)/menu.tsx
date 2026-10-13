import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useMobileCart } from '../../store/useMobileCart';

const CATEGORIES = [
  'All',
  'Hot & Cold Coffee',
  'Burgers & Sandwiches',
  'Pizzas',
  'Snacks',
  'Desserts',
];

const FULL_MENU = [
  {
    id: 'm1',
    name: 'Classic Handcrafted Cappuccino',
    priceInPaise: 11000,
    category: 'Hot & Cold Coffee',
    desc: 'Rich double-shot espresso topped with velvet milk froth.',
    isVeg: true,
  },
  {
    id: 'm2',
    name: 'Kittu Hazelnut Cold Coffee',
    priceInPaise: 14000,
    category: 'Hot & Cold Coffee',
    desc: 'Thick blend with roasted hazelnut syrup & ice cream.',
    isVeg: true,
  },
  {
    id: 'm3',
    name: 'Grilled Paneer Tikka Sandwich',
    priceInPaise: 13000,
    category: 'Burgers & Sandwiches',
    desc: 'Marinated cottage cheese, capsicum, mint chutney, cheese.',
    isVeg: true,
  },
  {
    id: 'm4',
    name: 'Veg Loaded Farmhouse Pizza',
    priceInPaise: 22000,
    category: 'Pizzas',
    desc: 'Stone-baked crust loaded with mozzarella, capsicum & corn.',
    isVeg: true,
  },
  {
    id: 'm5',
    name: 'Peri Peri Masala Fries',
    priceInPaise: 9000,
    category: 'Snacks',
    desc: 'Golden potato fries tossed in fiery peri peri spice mix.',
    isVeg: true,
  },
  {
    id: 'm6',
    name: 'Sizzling Brownie with Vanilla',
    priceInPaise: 15000,
    category: 'Desserts',
    desc: 'Warm fudge brownie served with cold vanilla scoop & fudge.',
    isVeg: true,
  },
];

export default function MobileMenuScreen() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const addItem = useMobileCart((state) => state.addItem);

  const filtered = FULL_MENU.filter((item) => {
    if (selectedCat !== 'All' && item.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search coffee, pizza, burgers..."
          placeholderTextColor="#8D6E63"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryPills}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCat(cat)}
            style={[
              styles.pill,
              selectedCat === cat ? styles.pillActive : styles.pillInactive,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                selectedCat === cat ? styles.pillTextActive : styles.pillTextInactive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu List */}
      <ScrollView contentContainerStyle={styles.menuList}>
        {filtered.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardInfo}>
              <View style={styles.vegIndicator}>
                <View style={styles.vegDot} />
              </View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
              <Text style={styles.cardPrice}>₹{(item.priceInPaise / 100).toFixed(0)}</Text>
            </View>

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
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6F0' },
  searchContainer: { padding: 12, backgroundColor: '#FFFEFA' },
  searchInput: {
    backgroundColor: '#FAF6F0',
    borderColor: '#EBE0D2',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: '#231709',
  },
  categoryPills: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#FAF6F0',
  },
  pill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  pillActive: { backgroundColor: '#231709', borderColor: '#231709' },
  pillInactive: { backgroundColor: '#FFFEFA', borderColor: '#EBE0D2' },
  pillText: { fontSize: 11, fontWeight: 'bold' },
  pillTextActive: { color: '#FFFFFF' },
  pillTextInactive: { color: '#4E342E' },
  menuList: { padding: 12, gap: 10, paddingBottom: 30 },
  card: {
    backgroundColor: '#FFFEFA',
    borderRadius: 16,
    borderColor: '#EBE0D2',
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  cardInfo: { flex: 1, gap: 3 },
  vegIndicator: {
    width: 12,
    height: 12,
    borderColor: '#10B981',
    borderWidth: 1.5,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  vegDot: { width: 6, height: 6, backgroundColor: '#10B981', borderRadius: 3 },
  cardTitle: { fontSize: 13, fontWeight: 'bold', color: '#231709' },
  cardDesc: { fontSize: 11, color: '#5D4037', lineHeight: 15 },
  cardPrice: { fontSize: 14, fontWeight: '800', color: '#231709', marginTop: 4 },
  addBtn: {
    backgroundColor: '#231709',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 11 },
});
