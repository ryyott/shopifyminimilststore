import {
  type LiveAnalytics,
  type ReportsAnalytics,
  type ConversionFunnelStep,
  type ProductPerformance,
  type TrafficData,
  type RevenueData,
  type VisitorProfile,
} from "@/types/analytics"

// Helper for consistent dates
const now = new Date("2024-02-14T12:00:00")

// Generate visitor profiles with purchases
const generateVisitorProfiles = (): VisitorProfile[] => {
  const names = [
    "Royal Elephant",
    "Pearl Tiger",
    "Azure Dragon",
    "Golden Phoenix",
    "Silver Falcon",
    "Crimson Wolf",
    "Emerald Leopard",
    "Sapphire Hawk",
  ]

  const cities = [
    {
      city: "Delhi",
      country: "India",
      countryCode: "IN",
      flagEmoji: "🇮🇳",
      lat: 28.6139,
      lng: 77.209,
    },
    {
      city: "Shanghai",
      country: "China",
      countryCode: "CN",
      flagEmoji: "🇨🇳",
      lat: 31.2304,
      lng: 121.4737,
    },
    {
      city: "New York",
      country: "United States",
      countryCode: "US",
      flagEmoji: "🇺🇸",
      lat: 40.7128,
      lng: -74.006,
    },
    {
      city: "London",
      country: "United Kingdom",
      countryCode: "GB",
      flagEmoji: "🇬🇧",
      lat: 51.5074,
      lng: -0.1278,
    },
    {
      city: "Tokyo",
      country: "Japan",
      countryCode: "JP",
      flagEmoji: "🇯🇵",
      lat: 35.6762,
      lng: 139.6503,
    },
    {
      city: "Sydney",
      country: "Australia",
      countryCode: "AU",
      flagEmoji: "🇦🇺",
      lat: -33.8688,
      lng: 151.2093,
    },
    {
      city: "Paris",
      country: "France",
      countryCode: "FR",
      flagEmoji: "🇫🇷",
      lat: 48.8566,
      lng: 2.3522,
    },
    {
      city: "Toronto",
      country: "Canada",
      countryCode: "CA",
      flagEmoji: "🇨🇦",
      lat: 43.6532,
      lng: -79.3832,
    },
  ]

  const pages = ["/docs", "/api-docs", "/pricing", "/dashboard", "/features", "/integrations"]
  const referrers = ["Google", "Baidu", "Direct", "Twitter", "LinkedIn"]

  return names.map((name, index) => {
    const location = cities[index]
    const hasPurchase = index % 2 === 0 // Deterministic: every other visitor has a purchase

    return {
      id: `visitor-${index + 1}`,
      name,
      avatar: `https://avatar.vercel.sh/${encodeURIComponent(name)}`,
      location,
      firstSeen: new Date(now.getTime() - ((index * 17) % 7) * 24 * 60 * 60 * 1000), // 0-6 days ago
      sessions: 1 + (index % 10), // 1-10 sessions
      events: 5 + ((index * 7) % 50), // 5-54 events
      currentPage: pages[index % pages.length],
      referrer: referrers[index % referrers.length],
      purchase: hasPurchase
        ? {
            orderNumber: `ORD-${String(1000 + index).padStart(4, "0")}`,
            total: 100 + ((index * 37) % 500), // $100-$599
            items: 1 + (index % 3), // 1-3 items
            trackingNumber: `TRK${String(100000 + index * 123).padStart(6, "0")}`,
            status: ["processing", "shipped", "delivered"][
              index % 3
            ] as "processing" | "shipped" | "delivered",
          }
        : undefined,
    }
  })
}

const visitorProfiles = generateVisitorProfiles()

// ========== LIVE ANALYTICS MOCK DATA ==========

export const mockLiveAnalytics: LiveAnalytics = {
  totalVisitors: 49,
  currentOnline: 12,
  lastUpdated: now,

  locations: [
    {
      lat: 37.7749,
      lng: -122.4194,
      city: "San Francisco",
      country: "United States",
      countryCode: "US",
      visitors: 8,
    },
    {
      lat: 40.7128,
      lng: -74.006,
      city: "New York",
      country: "United States",
      countryCode: "US",
      visitors: 8,
    },
    {
      lat: 39.9042,
      lng: 116.4074,
      city: "Beijing",
      country: "China",
      countryCode: "CN",
      visitors: 4,
    },
    {
      lat: 51.5074,
      lng: -0.1278,
      city: "London",
      country: "United Kingdom",
      countryCode: "GB",
      visitors: 6,
    },
    {
      lat: 48.8566,
      lng: 2.3522,
      city: "Paris",
      country: "France",
      countryCode: "FR",
      visitors: 3,
    },
    {
      lat: 35.6762,
      lng: 139.6503,
      city: "Tokyo",
      country: "Japan",
      countryCode: "JP",
      visitors: 5,
    },
    {
      lat: -33.8688,
      lng: 151.2093,
      city: "Sydney",
      country: "Australia",
      countryCode: "AU",
      visitors: 7,
    },
    {
      lat: 52.52,
      lng: 13.405,
      city: "Berlin",
      country: "Germany",
      countryCode: "DE",
      visitors: 4,
    },
    {
      lat: 43.6532,
      lng: -79.3832,
      city: "Toronto",
      country: "Canada",
      countryCode: "CA",
      visitors: 4,
    },
  ],

  topPages: [
    { path: "/pricing", visits: 8, uniqueVisitors: 6, avgDuration: 145 },
    { path: "/dashboard", visits: 7, uniqueVisitors: 5, avgDuration: 203 },
    { path: "/features", visits: 7, uniqueVisitors: 5, avgDuration: 187 },
    { path: "/integrations", visits: 6, uniqueVisitors: 5, avgDuration: 156 },
    { path: "/docs", visits: 5, uniqueVisitors: 4, avgDuration: 298 },
    { path: "/api-docs", visits: 5, uniqueVisitors: 3, avgDuration: 245 },
  ],

  topReferrers: [
    { source: "Direct", visits: 22, percentage: 44.9 },
    { source: "Google", visits: 12, percentage: 24.5 },
    { source: "Twitter", visits: 4, percentage: 8.2 },
    { source: "LinkedIn", visits: 2, percentage: 4.1 },
    { source: "Hacker News", visits: 2, percentage: 4.1 },
  ],

  topCountries: [
    {
      country: "United States",
      countryCode: "US",
      visits: 16,
      percentage: 32.7,
      flagEmoji: "🇺🇸",
    },
    {
      country: "China",
      countryCode: "CN",
      visits: 4,
      percentage: 8.2,
      flagEmoji: "🇨🇳",
    },
    {
      country: "United Kingdom",
      countryCode: "GB",
      visits: 3,
      percentage: 6.1,
      flagEmoji: "🇬🇧",
    },
    {
      country: "Algeria",
      countryCode: "DZ",
      visits: 3,
      percentage: 6.1,
      flagEmoji: "🇩🇿",
    },
    {
      country: "Japan",
      countryCode: "JP",
      visits: 2,
      percentage: 4.1,
      flagEmoji: "🇯🇵",
    },
    {
      country: "Germany",
      countryCode: "DE",
      visits: 2,
      percentage: 4.1,
      flagEmoji: "🇩🇪",
    },
  ],
}

// Export visitor profiles for globe visualization
export { visitorProfiles }

// ========== REPORTS ANALYTICS MOCK DATA ==========

// Generate 30 days of traffic data
const generateTrafficData = (): TrafficData[] => {
  const data: TrafficData[] = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    // Deterministic traffic values
    const baseVisitors = 300 + ((i * 17) % 200) // 300-500 visitors
    data.push({
      date,
      visitors: baseVisitors,
      uniqueVisitors: Math.floor(baseVisitors * 0.8), // 80% unique
      pageViews: Math.floor(baseVisitors * 3.5), // ~3.5 pages per visitor
      bounceRate: 40 + ((i * 7) % 20), // 40-60% bounce rate
    })
  }
  return data
}

// Generate 30 days of revenue data
const generateRevenueData = (): RevenueData[] => {
  const data: RevenueData[] = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    // Deterministic values based on day index
    const orders = 10 + ((i * 3) % 15) // 10-24 orders
    const aov = 175 + ((i * 11) % 75) // $175-$250 AOV
    data.push({
      date,
      orders,
      revenue: orders * aov,
      averageOrderValue: aov,
    })
  }
  return data
}

const mockConversionFunnel: ConversionFunnelStep[] = [
  { step: "Product View", visitors: 1000, percentage: 100, dropoff: 0 },
  { step: "Add to Cart", visitors: 350, percentage: 35, dropoff: 65 },
  { step: "Checkout", visitors: 210, percentage: 21, dropoff: 40 },
  { step: "Payment", visitors: 180, percentage: 18, dropoff: 14.3 },
  { step: "Purchase Complete", visitors: 156, percentage: 15.6, dropoff: 13.3 },
]

const mockProductPerformance: ProductPerformance[] = [
  {
    productId: "PROD-001",
    productName: "Yeezy Boost 350 V2",
    views: 1245,
    addToCart: 342,
    purchases: 89,
    revenue: 19580,
    conversionRate: 7.15,
    imageUrl: "/products/11.png",
  },
  {
    productId: "PROD-002",
    productName: "Yeezy Foam Runner",
    views: 987,
    addToCart: 289,
    purchases: 76,
    revenue: 6840,
    conversionRate: 7.7,
    imageUrl: "/products/13.png",
  },
  {
    productId: "PROD-003",
    productName: "Yeezy Slides",
    views: 856,
    addToCart: 234,
    purchases: 67,
    revenue: 4690,
    conversionRate: 7.83,
    imageUrl: "/products/SL-01-1.png",
  },
  {
    productId: "PROD-004",
    productName: "Yeezy 700 V3",
    views: 723,
    addToCart: 198,
    purchases: 52,
    revenue: 10400,
    conversionRate: 7.19,
    imageUrl: "/products/15.png",
  },
  {
    productId: "PROD-005",
    productName: "Yeezy 500",
    views: 645,
    addToCart: 167,
    purchases: 43,
    revenue: 8600,
    conversionRate: 6.67,
    imageUrl: "/products/22.png",
  },
]

export const mockReportsAnalytics: ReportsAnalytics = {
  traffic: generateTrafficData(),
  conversionFunnel: mockConversionFunnel,
  productPerformance: mockProductPerformance,
  revenue: generateRevenueData(),
  dateRange: {
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29),
    end: now,
  },
}
