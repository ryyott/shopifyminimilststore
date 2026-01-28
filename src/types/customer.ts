export type CustomerSegment = "new" | "returning" | "vip" | "at-risk" | "churned";

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;

  // Metrics (calculated from orders)
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;

  // Segmentation
  segment: CustomerSegment;
  tags: string[];

  // Dates
  firstOrderDate?: Date;
  lastOrderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerStats {
  // Aggregate metrics
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  vipCustomers: number;
  atRiskCustomers: number;
  churnedCustomers: number;

  // Financial metrics
  averageOrderValue: number;
  averageLifetimeValue: number;
  totalRevenue: number;

  // Frequency metrics
  averagePurchaseFrequency: number;

  // Segment distribution
  segmentDistribution: Record<CustomerSegment, number>;
}

export interface CustomerMetrics {
  // Individual customer metrics
  aov: number;
  clv: number;
  predictedClv: number;
  purchaseFrequency: number;
  daysSinceLastOrder: number | null;
  daysSinceFirstOrder: number | null;
  lifetimeValue: number;
}
