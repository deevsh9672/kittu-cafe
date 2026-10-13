import mongoose, { Schema, Document } from 'mongoose';
import { BUSINESS_CONFIG } from '@kittu-cafe/shared';

export interface IOpeningHour {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface IRestaurantDocument extends Document {
  name: string;
  businessType: string;
  address: string;
  contactNumber: string;
  country: string;
  currency: string;
  timeZone: string;
  mapsUrl: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  openingHours: IOpeningHour[];
  taxPercentage: number; // e.g. 5 for 5% GST
  deliveryFeeInPaise: number;
  minOrderInPaise: number;
  freeDeliveryThresholdInPaise: number;
  deliveryRadiusKm: number;
  isOnlineOrderingOpen: boolean;
  isTableReservationOpen: boolean;
  announcementBanner?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  aboutText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurantDocument>(
  {
    name: { type: String, default: BUSINESS_CONFIG.name },
    businessType: { type: String, default: BUSINESS_CONFIG.businessType },
    address: { type: String, default: BUSINESS_CONFIG.address },
    contactNumber: { type: String, default: BUSINESS_CONFIG.contactNumber },
    country: { type: String, default: BUSINESS_CONFIG.country },
    currency: { type: String, default: BUSINESS_CONFIG.currency },
    timeZone: { type: String, default: BUSINESS_CONFIG.timeZone },
    mapsUrl: { type: String, default: BUSINESS_CONFIG.mapsUrl },
    coordinates: {
      latitude: { type: Number, default: BUSINESS_CONFIG.coordinates.latitude },
      longitude: { type: Number, default: BUSINESS_CONFIG.coordinates.longitude },
    },
    openingHours: [
      {
        day: { type: String, required: true },
        open: { type: String, default: '10:00' },
        close: { type: String, default: '22:30' },
        isClosed: { type: Boolean, default: false },
      },
    ],
    taxPercentage: { type: Number, default: 5 },
    deliveryFeeInPaise: { type: Number, default: 4000 }, // ₹40.00
    minOrderInPaise: { type: Number, default: 15000 }, // ₹150.00
    freeDeliveryThresholdInPaise: { type: Number, default: 49900 }, // ₹499.00
    deliveryRadiusKm: { type: Number, default: 10 },
    isOnlineOrderingOpen: { type: Boolean, default: true },
    isTableReservationOpen: { type: Boolean, default: true },
    announcementBanner: { type: String, default: 'Welcome to Kittu Cafe, Dausa! Fresh brew & delightful bites.' },
    heroHeadline: { type: String, default: 'Crafted Coffee & Fresh Flavors in Dausa' },
    heroSubheadline: { type: String, default: 'Experience warm hospitality, artisanal beverages, and handcrafted cafe specialties at Kittu Cafe.' },
    aboutText: { type: String, default: 'Kittu Cafe is located in Shiv Colony, Mariyara Wale, Dausa. We pride ourselves on authentic taste, cozy ambiance, and prompt service.' },
  },
  { timestamps: true }
);

export const RestaurantModel =
  mongoose.models.Restaurant || mongoose.model<IRestaurantDocument>('Restaurant', RestaurantSchema);
