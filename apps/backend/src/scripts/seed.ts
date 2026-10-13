import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  UserModel,
  RestaurantModel,
  MenuCategoryModel,
  MenuItemModel,
  IngredientModel,
  CouponModel,
} from '../models';
import { config } from '../config/env';
import { BUSINESS_CONFIG } from '@kittu-cafe/shared';

export async function runSeed() {
  console.log('[Seed] Connecting to MongoDB...');
  await mongoose.connect(config.MONGODB_URI);
  console.log('[Seed] Connected. Clearing existing demo collections...');

  await Promise.all([
    UserModel.deleteMany({}),
    RestaurantModel.deleteMany({}),
    MenuCategoryModel.deleteMany({}),
    MenuItemModel.deleteMany({}),
    IngredientModel.deleteMany({}),
    CouponModel.deleteMany({}),
  ]);

  console.log('[Seed] 1. Initializing verified Kittu Cafe profile...');
  await RestaurantModel.create({
    name: BUSINESS_CONFIG.name,
    businessType: BUSINESS_CONFIG.businessType,
    address: BUSINESS_CONFIG.address,
    contactNumber: BUSINESS_CONFIG.contactNumber,
    country: BUSINESS_CONFIG.country,
    currency: BUSINESS_CONFIG.currency,
    timeZone: BUSINESS_CONFIG.timeZone,
    mapsUrl: BUSINESS_CONFIG.mapsUrl,
    coordinates: BUSINESS_CONFIG.coordinates,
    taxPercentage: 5, // 5% GST
    deliveryFeeInPaise: 4000, // ₹40.00
    minOrderInPaise: 15000, // ₹150.00
    freeDeliveryThresholdInPaise: 49900, // ₹499.00
    deliveryRadiusKm: 10,
    isOnlineOrderingOpen: true,
    isTableReservationOpen: true,
    announcementBanner: 'Welcome to Kittu Cafe, Dausa! Enjoy authentic cafe culture & fast delivery.',
    heroHeadline: 'Artisanal Coffee & Crafted Bites in Dausa',
    heroSubheadline: 'Freshly brewed coffee, grilled sandwiches, and stone-baked pizzas crafted with warmth.',
    aboutText: 'Kittu Cafe is located in Shiv Colony, Mariyara Wale, Dausa. We offer a relaxed ambiance, quality ingredients, and welcoming hospitality.',
    openingHours: [
      { day: 'Monday', open: '10:00', close: '22:30', isClosed: false },
      { day: 'Tuesday', open: '10:00', close: '22:30', isClosed: false },
      { day: 'Wednesday', open: '10:00', close: '22:30', isClosed: false },
      { day: 'Thursday', open: '10:00', close: '22:30', isClosed: false },
      { day: 'Friday', open: '10:00', close: '23:00', isClosed: false },
      { day: 'Saturday', open: '10:00', close: '23:00', isClosed: false },
      { day: 'Sunday', open: '10:00', close: '23:00', isClosed: false },
    ],
  });

  console.log('[Seed] 2. Creating default Staff accounts...');
  const adminPasswordHash = await bcrypt.hash(config.SEED_ADMIN_PASSWORD, 10);
  const kitchenPasswordHash = await bcrypt.hash('Kitchen@2026', 10);

  await UserModel.create([
    {
      name: 'Kittu Admin',
      phone: config.SEED_ADMIN_PHONE,
      email: config.SEED_ADMIN_EMAIL,
      passwordHash: adminPasswordHash,
      role: 'admin',
      isActive: true,
    },
    {
      name: 'Chef Rampal',
      phone: '+919511317457',
      email: 'kitchen@kittucafe.in',
      passwordHash: kitchenPasswordHash,
      role: 'kitchen',
      isActive: true,
    },
    {
      name: 'Customer Demo',
      phone: '+919876543210',
      email: 'customer@demo.com',
      passwordHash: await bcrypt.hash('Demo@123', 10),
      role: 'customer',
      loyaltyPoints: 120,
      savedAddresses: [
        {
          street: 'Near Somnath Temple, Agra Road',
          area: 'Shiv Colony',
          city: 'Dausa',
          postalCode: '303303',
          landmark: 'Opposite State Bank',
          isDefault: true,
        },
      ],
    },
  ]);

  console.log('[Seed] 3. Creating Menu Categories...');
  const catCoffee = await MenuCategoryModel.create({
    name: 'Hot & Cold Coffee',
    description: 'Freshly roasted arabica & robusta espresso blends',
    icon: 'coffee',
    sortOrder: 1,
  });

  const catSandwiches = await MenuCategoryModel.create({
    name: 'Burgers & Sandwiches',
    description: 'Toasted gourmet sandwiches & juicy cafe burgers',
    icon: 'sandwich',
    sortOrder: 2,
  });

  const catPizza = await MenuCategoryModel.create({
    name: 'Pizzas & Garlic Breads',
    description: 'Crispy stone-baked pizzas with loaded mozzarella',
    icon: 'pizza',
    sortOrder: 3,
  });

  const catSnacks = await MenuCategoryModel.create({
    name: 'Snacks & Sides',
    description: 'Crispy finger foods, fries, and nachos',
    icon: 'utensils',
    sortOrder: 4,
  });

  const catDesserts = await MenuCategoryModel.create({
    name: 'Desserts & Shakes',
    description: 'Indulgent thick shakes and warm brownies',
    icon: 'ice-cream',
    sortOrder: 5,
  });

  console.log('[Seed] 4. Seeding Initial Menu items (Integer Paise representation)...');
  await MenuItemModel.create([
    {
      name: 'Classic Handcrafted Cappuccino',
      description: 'Rich double-shot espresso topped with velvet steamed milk froth.',
      categoryId: catCoffee._id,
      basePriceInPaise: 11000, // ₹110.00
      dietaryType: 'veg',
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMinutes: 8,
      variants: [
        { name: 'Regular (250ml)', priceInPaise: 11000, isDefault: true },
        { name: 'Large (350ml)', priceInPaise: 14000, isDefault: false },
      ],
      addOnGroups: [
        {
          title: 'Customizations',
          minSelections: 0,
          maxSelections: 2,
          items: [
            { name: 'Extra Espresso Shot', priceInPaise: 3000 }, // ₹30
            { name: 'Caramel Syrup', priceInPaise: 2500 }, // ₹25
            { name: 'Almond Milk', priceInPaise: 4000 }, // ₹40
          ],
        },
      ],
    },
    {
      name: 'Kittu Hazelnut Cold Coffee',
      description: 'Creamy chilled thick blend with roasted hazelnut syrup and ice cream.',
      categoryId: catCoffee._id,
      basePriceInPaise: 14000, // ₹140.00
      dietaryType: 'veg',
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMinutes: 10,
      variants: [
        { name: 'Regular', priceInPaise: 14000, isDefault: true },
        { name: 'Thick Frappe', priceInPaise: 17000, isDefault: false },
      ],
      addOnGroups: [
        {
          title: 'Toppings',
          minSelections: 0,
          maxSelections: 2,
          items: [
            { name: 'Chocolate Drizzle', priceInPaise: 2000 },
            { name: 'Vanilla Scoop', priceInPaise: 3000 },
          ],
        },
      ],
    },
    {
      name: 'Grilled Paneer Tikka Sandwich',
      description: 'Marinated cottage cheese, capsicum, onions, mint chutney, and molten cheese.',
      categoryId: catSandwiches._id,
      basePriceInPaise: 13000, // ₹130.00
      dietaryType: 'veg',
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMinutes: 12,
      variants: [],
      addOnGroups: [
        {
          title: 'Extra Add-ons',
          minSelections: 0,
          maxSelections: 2,
          items: [
            { name: 'Extra Cheese Slice', priceInPaise: 2500 },
            { name: 'Jalapeno & Olives', priceInPaise: 2000 },
          ],
        },
      ],
    },
    {
      name: 'Veg Loaded Farmhouse Pizza',
      description: 'Crispy base loaded with fresh mozzarella, capsicum, red onions, mushrooms, and sweet corn.',
      categoryId: catPizza._id,
      basePriceInPaise: 22000, // ₹220.00
      dietaryType: 'veg',
      isAvailable: true,
      isFeatured: true,
      isBestseller: false,
      preparationTimeMinutes: 18,
      variants: [
        { name: 'Medium (8 inch)', priceInPaise: 22000, isDefault: true },
        { name: 'Large (10 inch)', priceInPaise: 32000, isDefault: false },
      ],
      addOnGroups: [
        {
          title: 'Crust Options',
          minSelections: 0,
          maxSelections: 1,
          items: [
            { name: 'Cheese Burst Crust', priceInPaise: 6000 },
          ],
        },
      ],
    },
    {
      name: 'Peri Peri Masala Fries',
      description: 'Crispy golden potato fries tossed in fiery African peri peri spice blend.',
      categoryId: catSnacks._id,
      basePriceInPaise: 9000, // ₹90.00
      dietaryType: 'veg',
      isAvailable: true,
      isFeatured: false,
      isBestseller: true,
      preparationTimeMinutes: 8,
      variants: [],
      addOnGroups: [
        {
          title: 'Dips',
          minSelections: 0,
          maxSelections: 2,
          items: [
            { name: 'Cheesy Jalapeno Dip', priceInPaise: 2500 },
            { name: 'Tandoori Mayo Dip', priceInPaise: 2000 },
          ],
        },
      ],
    },
    {
      name: 'Sizzling Brownie with Vanilla',
      description: 'Warm fudge brownie served sizzling with rich chocolate sauce and cold vanilla ice cream.',
      categoryId: catDesserts._id,
      basePriceInPaise: 15000, // ₹150.00
      dietaryType: 'veg',
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMinutes: 10,
      variants: [],
      addOnGroups: [],
    },
  ]);

  console.log('[Seed] 5. Creating Initial Ingredients for Stock Management...');
  await IngredientModel.create([
    { name: 'Roasted Coffee Beans', unit: 'grams', currentStock: 5000, lowStockThreshold: 1000, costPerUnitInPaise: 150 },
    { name: 'Full Cream Milk', unit: 'ml', currentStock: 20000, lowStockThreshold: 3000, costPerUnitInPaise: 6 },
    { name: 'Mozzarella Cheese', unit: 'grams', currentStock: 8000, lowStockThreshold: 1500, costPerUnitInPaise: 45 },
    { name: 'Fresh Paneer', unit: 'grams', currentStock: 4000, lowStockThreshold: 1000, costPerUnitInPaise: 35 },
    { name: 'Potato Fries (Frozen)', unit: 'grams', currentStock: 10000, lowStockThreshold: 2000, costPerUnitInPaise: 15 },
    { name: 'Chocolate Fudge Brownie', unit: 'pieces', currentStock: 30, lowStockThreshold: 5, costPerUnitInPaise: 4000 },
  ]);

  console.log('[Seed] 6. Creating Promotional Coupons...');
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 3);

  await CouponModel.create([
    {
      code: 'KITTU50',
      description: 'Get 50% discount up to ₹100 on orders above ₹200',
      discountType: 'percentage',
      discountValue: 50,
      maxDiscountInPaise: 10000, // ₹100
      minOrderInPaise: 20000, // ₹200
      usageLimit: 500,
      perCustomerLimit: 2,
      startDate: new Date(),
      expiryDate: nextMonth,
      isActive: true,
    },
    {
      code: 'WELCOME50',
      description: 'Flat ₹50 OFF for welcome orders above ₹250',
      discountType: 'fixed',
      discountValue: 5000, // ₹50
      minOrderInPaise: 25000, // ₹250
      usageLimit: 1000,
      perCustomerLimit: 1,
      startDate: new Date(),
      expiryDate: nextMonth,
      isActive: true,
    },
  ]);

  console.log('[Seed] ==============================================');
  console.log('[Seed] Database seeded successfully!');
  console.log('[Seed] Admin login: admin@kittucafe.in / KittuAdmin@2026');
  console.log('[Seed] Kitchen login: kitchen@kittucafe.in / Kitchen@2026');
  console.log('[Seed] Phone OTP test mode: Use 123456');
  console.log('[Seed] ==============================================');

  await mongoose.disconnect();
}

if (require.main === module) {
  runSeed().catch(err => {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  });
}
