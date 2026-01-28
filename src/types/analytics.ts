import type { CustomerSegment } from "./customer";

export interface TimeSeriesData {
  date: Date;
  value: number;
}

export interface CustomerGrowthData extends TimeSeriesData {
  newCustomers: number;
  totalCustomers: number;
}

export interface RevenueBySegmentData {
  segment: CustomerSegment;
  revenue: number;
  customerCount: number;
  averageOrderValue: number;
}

export interface CLVDistribution {
  range: string; // e.g., "$0-100", "$100-500"
  count: number;
  minValue: number;
  maxValue: number;
}

export interface SubscriberGrowthData extends TimeSeriesData {
  subscribers: number;
  unsubscribes: number;
  netGrowth: number;
}

// Live Analytics Types
export interface VisitorProfile {
  id: string;
  name: string;
  avatar: string; // Vercel avatar URL
  location: {
    city: string;
    country: string;
    countryCode: string;
    flagEmoji?: string;
    lat: number;
    lng: number;
  };
  firstSeen: Date;
  sessions: number;
  events: number;
  currentPage?: string;
  referrer?: string;
  purchase?: {
    orderNumber: string;
    total: number;
    items: number;
    trackingNumber?: string;
    status: "processing" | "shipped" | "delivered";
  };
}

export interface VisitorLocation {
  lat: number;
  lng: number;
  city: string;
  country: string;
  countryCode: string; // ISO 2-letter code (e.g., "US", "CN")
  visitors: number;
  profiles?: VisitorProfile[]; // Individual visitors at this location
}

export interface PageVisit {
  path: string;
  visits: number;
  uniqueVisitors: number;
  avgDuration: number; // seconds
}

export interface Referrer {
  source: string;
  visits: number;
  percentage: number;
}

export interface CountryStat {
  country: string;
  countryCode: string;
  visits: number;
  percentage: number;
  flagEmoji: string; // e.g., "🇺🇸"
}

export interface LiveAnalytics {
  totalVisitors: number;
  currentOnline: number;
  locations: VisitorLocation[];
  topPages: PageVisit[];
  topReferrers: Referrer[];
  topCountries: CountryStat[];
  lastUpdated: Date;
}

// Reports Analytics Types
export interface TrafficData {
  date: Date;
  visitors: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number; // percentage
}

export interface ConversionFunnelStep {
  step: string;
  visitors: number;
  percentage: number;
  dropoff: number; // percentage dropped from previous step
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  views: number;
  addToCart: number;
  purchases: number;
  revenue: number;
  conversionRate: number; // percentage
  imageUrl?: string;
}

export interface RevenueData {
  date: Date;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface ReportsAnalytics {
  traffic: TrafficData[];
  conversionFunnel: ConversionFunnelStep[];
  productPerformance: ProductPerformance[];
  revenue: RevenueData[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

// Chart-specific types
export type TimeRange = "7d" | "30d" | "90d" | "12m" | "custom";

export interface DateRangeFilter {
  from: Date;
  to: Date;
  preset?: TimeRange;
}
