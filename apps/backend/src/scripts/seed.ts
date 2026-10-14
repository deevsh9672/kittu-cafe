import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  UserModel,
  RestaurantModel,
  MenuCategoryModel,
  MenuItemModel,
  IngredientModel,
  CouponModel,
  InventoryItemModel,
  InventoryMovementModel,
  RecipeModel,
  SupplierModel,
  PurchaseOrderModel,
  ExpenseModel,
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
    InventoryItemModel.deleteMany({}),
    InventoryMovementModel.deleteMany({}),
    RecipeModel.deleteMany({}),
    SupplierModel.deleteMany({}),
    PurchaseOrderModel.deleteMany({}),
    ExpenseModel.deleteMany({}),
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
  const createdMenuItems = await MenuItemModel.create([
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

  console.log('[Seed] 5. Creating Cafe Suppliers...');
  const supBev = await SupplierModel.create({
    name: 'Dausa Beverage & Chiller Distributors',
    contactPerson: 'Mukesh Sharma',
    phone: '+91 98290 11223',
    email: 'sales@dausabeverages.com',
    address: 'Shop 14, Mandi Road, Dausa, Rajasthan 303303',
    gstin: '08AAAAA0000A1Z5',
    paymentTerms: 'Net 15 days',
    categoriesSupplied: ['Cold Drinks', 'Energy Drinks', 'Packaged Water'],
    notes: 'Primary supplier for Red Bull, Coke, and Sprite cans.',
    isActive: true,
  });

  const supDairy = await SupplierModel.create({
    name: 'Rajasthan Dairy & Farm Fresh',
    contactPerson: 'Rajesh Meena',
    phone: '+91 94140 44556',
    email: 'orders@rajdairydausa.in',
    address: 'Near Old Bus Stand, Dausa, Rajasthan 303303',
    gstin: '08BBBBB1111B2Z4',
    paymentTerms: 'Weekly Cash / UPI',
    categoriesSupplied: ['Dairy', 'Paneer', 'Cheese'],
    notes: 'Daily morning delivery of fresh cow milk and malai paneer.',
    isActive: true,
  });

  console.log('[Seed] 6. Creating Packaged Beverages and Food Ingredients...');
  const bevRedBull = await InventoryItemModel.create({
    name: 'Red Bull Energy Drink',
    sku: 'BEV-RB-250',
    barcode: '9002490100070',
    itemType: 'beverage',
    category: 'Energy Drinks',
    brand: 'Red Bull',
    packageSize: '250ml',
    stockUnit: 'can',
    openingStock: 24,
    currentQuantity: 24,
    minStockThreshold: 6,
    reorderQuantity: 24,
    purchasePriceInPaise: 9500, // ₹95.00
    sellingPriceInPaise: 12500, // ₹125.00
    supplierId: supBev._id,
    storageLocation: 'Beverage Chiller A',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  });

  const bevCoke = await InventoryItemModel.create({
    name: 'Coca-Cola Can',
    sku: 'BEV-COKE-330',
    barcode: '5449000000996',
    itemType: 'beverage',
    category: 'Cold Drinks',
    brand: 'Coca-Cola',
    packageSize: '330ml',
    stockUnit: 'can',
    openingStock: 48,
    currentQuantity: 48,
    minStockThreshold: 12,
    reorderQuantity: 48,
    purchasePriceInPaise: 3000, // ₹30.00
    sellingPriceInPaise: 4000, // ₹40.00
    supplierId: supBev._id,
    storageLocation: 'Beverage Chiller B',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  });

  const bevSprite = await InventoryItemModel.create({
    name: 'Sprite Can',
    sku: 'BEV-SPRITE-330',
    barcode: '5449000014528',
    itemType: 'beverage',
    category: 'Cold Drinks',
    brand: 'Sprite',
    packageSize: '330ml',
    stockUnit: 'can',
    openingStock: 24,
    currentQuantity: 24,
    minStockThreshold: 8,
    reorderQuantity: 24,
    purchasePriceInPaise: 3000,
    sellingPriceInPaise: 4000,
    supplierId: supBev._id,
    storageLocation: 'Beverage Chiller B',
    imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  });

  const bevWater = await InventoryItemModel.create({
    name: 'Packaged Drinking Water (Kinley)',
    sku: 'BEV-WATER-500',
    itemType: 'beverage',
    category: 'Packaged Water',
    brand: 'Kinley',
    packageSize: '500ml',
    stockUnit: 'bottle',
    openingStock: 60,
    currentQuantity: 60,
    minStockThreshold: 15,
    reorderQuantity: 60,
    purchasePriceInPaise: 1000,
    sellingPriceInPaise: 2000,
    supplierId: supBev._id,
    storageLocation: 'Front Counter Rack',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  });

  const ingMilk = await InventoryItemModel.create({
    name: 'Fresh Cow Milk (Dairy Gold)',
    sku: 'ING-MILK-L',
    itemType: 'ingredient',
    category: 'Dairy',
    packageSize: '1L Pouch',
    stockUnit: 'L',
    openingStock: 30,
    currentQuantity: 30,
    minStockThreshold: 5,
    reorderQuantity: 20,
    purchasePriceInPaise: 6400, // ₹64/L
    supplierId: supDairy._id,
    storageLocation: 'Dairy Fridge 1',
    isActive: true,
  });

  const ingCoffee = await InventoryItemModel.create({
    name: 'Roasted Arabica Coffee Beans',
    sku: 'ING-COFFEE-KG',
    itemType: 'ingredient',
    category: 'Coffee',
    packageSize: '1kg Bag',
    stockUnit: 'kg',
    openingStock: 10,
    currentQuantity: 10,
    minStockThreshold: 2,
    reorderQuantity: 5,
    purchasePriceInPaise: 85000, // ₹850/kg
    storageLocation: 'Dry Pantry Bin 2',
    isActive: true,
  });

  const ingCheese = await InventoryItemModel.create({
    name: 'Mozzarella Cheese Blend',
    sku: 'ING-CHEESE-KG',
    itemType: 'ingredient',
    category: 'Dairy',
    packageSize: '1kg Shredded',
    stockUnit: 'kg',
    openingStock: 12,
    currentQuantity: 12,
    minStockThreshold: 3,
    reorderQuantity: 8,
    purchasePriceInPaise: 48000,
    supplierId: supDairy._id,
    storageLocation: 'Dairy Freezer',
    isActive: true,
  });

  const ingPizzaBase = await InventoryItemModel.create({
    name: 'Stone Baked Pizza Base (8-inch)',
    sku: 'ING-PIZZABASE-8',
    itemType: 'ingredient',
    category: 'Bakery',
    packageSize: 'Pack of 5',
    stockUnit: 'piece',
    openingStock: 40,
    currentQuantity: 40,
    minStockThreshold: 10,
    reorderQuantity: 30,
    purchasePriceInPaise: 2500,
    storageLocation: 'Bakery Rack',
    isActive: true,
  });

  console.log('[Seed] 7. Creating Initial Stock Movements in Immutable Ledger...');
  await InventoryMovementModel.create([
    {
      inventoryItemId: bevRedBull._id,
      operationType: 'purchase_receipt',
      previousQuantity: 0,
      newQuantity: 24,
      changeQuantity: 24,
      unitCostInPaise: 9500,
      totalCostInPaise: 228000,
      reason: 'Initial Opening Stock receipt from PO-2026-001',
      referenceId: 'PO-2026-001',
      performedBy: 'admin',
      timestamp: new Date(),
    },
    {
      inventoryItemId: bevCoke._id,
      operationType: 'purchase_receipt',
      previousQuantity: 0,
      newQuantity: 48,
      changeQuantity: 48,
      unitCostInPaise: 3000,
      totalCostInPaise: 144000,
      reason: 'Initial Opening Stock receipt from PO-2026-001',
      referenceId: 'PO-2026-001',
      performedBy: 'admin',
      timestamp: new Date(),
    },
  ]);

  console.log('[Seed] 8. Creating Recipe Mappings for Auto-Deductions...');
  const cappItem = createdMenuItems.find((i: any) => i.name.includes('Cappuccino'));
  if (cappItem) {
    await RecipeModel.create({
      menuItemId: cappItem._id,
      name: 'Classic Handcrafted Cappuccino Recipe',
      ingredients: [
        { inventoryItemId: ingCoffee._id, ingredientName: ingCoffee.name, quantityRequired: 0.015, unit: 'kg' }, // 15g
        { inventoryItemId: ingMilk._id, ingredientName: ingMilk.name, quantityRequired: 0.2, unit: 'L' }, // 200ml
      ],
      version: 1,
      isActive: true,
    });
  }

  const pizzaItem = createdMenuItems.find((i: any) => i.name.includes('Pizza'));
  if (pizzaItem) {
    await RecipeModel.create({
      menuItemId: pizzaItem._id,
      name: 'Veg Loaded Farmhouse Pizza Recipe',
      ingredients: [
        { inventoryItemId: ingPizzaBase._id, ingredientName: ingPizzaBase.name, quantityRequired: 1, unit: 'piece' },
        { inventoryItemId: ingCheese._id, ingredientName: ingCheese.name, quantityRequired: 0.15, unit: 'kg' }, // 150g
      ],
      version: 1,
      isActive: true,
    });
  }

  console.log('[Seed] 9. Creating Operating Expenses for Financial Reports...');
  await ExpenseModel.create([
    {
      title: 'Monthly Cafe Store Rent (Shiv Colony, Dausa)',
      category: 'rent',
      amountInPaise: 2500000, // ₹25,000.00
      date: new Date(Date.now() - 86400000 * 5),
      description: 'Monthly commercial rental for Kittu Cafe building',
      recordedBy: 'admin',
    },
    {
      title: 'Commercial 3-Phase Power Bill (JVVNL Dausa)',
      category: 'utilities',
      amountInPaise: 685000, // ₹6,850.00
      date: new Date(Date.now() - 86400000 * 3),
      description: 'Chiller, oven, and espresso machine electricity consumption',
      recordedBy: 'admin',
    },
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
