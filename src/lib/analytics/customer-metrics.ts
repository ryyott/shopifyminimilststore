import type { Order } from "@/types/order";
import type { Customer, CustomerMetrics, CustomerStats } from "@/types/customer";

/**
 * Calculate Average Order Value from an array of orders
 */
export function calculateAOV(orders: Order[]): number {
  if (orders.length === 0) return 0;

  const paidOrders = orders.filter(
    (o) => o.paymentStatus === "paid" || o.paymentStatus === "refunded"
  );

  if (paidOrders.length === 0) return 0;

  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  return totalRevenue / paidOrders.length;
}

/**
 * Calculate Customer Lifetime Value (total spent)
 */
export function calculateCLV(customer: Customer): number {
  return customer.totalSpent;
}

/**
 * Calculate Predicted CLV based on purchase patterns
 * Simple formula: AOV × Purchase Frequency × Estimated Lifespan
 */
export function calculatePredictedCLV(customer: Customer): number {
  if (!customer.firstOrderDate || !customer.lastOrderDate) {
    return customer.totalSpent;
  }

  const daysSinceFirst = daysBetween(customer.firstOrderDate, new Date());

  // If customer is too new (less than 30 days), return current CLV
  if (daysSinceFirst < 30) {
    return customer.totalSpent;
  }

  // Calculate monthly spend rate
  const monthsSinceFirst = daysSinceFirst / 30;
  const monthlySpendRate = customer.totalSpent / monthsSinceFirst;

  // Estimate 24-month customer lifespan (industry average)
  const estimatedLifespanMonths = 24;

  return monthlySpendRate * estimatedLifespanMonths;
}

/**
 * Calculate purchase frequency (orders per month)
 */
export function calculatePurchaseFrequency(customer: Customer): number {
  if (!customer.firstOrderDate || customer.totalOrders === 0) {
    return 0;
  }

  const daysSinceFirst = daysBetween(customer.firstOrderDate, new Date());

  // Avoid division by zero
  if (daysSinceFirst === 0) {
    return customer.totalOrders;
  }

  const monthsSinceFirst = daysSinceFirst / 30;
  return customer.totalOrders / monthsSinceFirst;
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffMs / oneDay);
}

/**
 * Get days since last order
 */
export function daysSinceLastOrder(customer: Customer): number | null {
  if (!customer.lastOrderDate) return null;
  return daysBetween(customer.lastOrderDate, new Date());
}

/**
 * Get days since first order
 */
export function daysSinceFirstOrder(customer: Customer): number | null {
  if (!customer.firstOrderDate) return null;
  return daysBetween(customer.firstOrderDate, new Date());
}

/**
 * Calculate all metrics for a single customer
 */
export function calculateCustomerMetrics(
  customer: Customer,
  orders: Order[]
): CustomerMetrics {
  const customerOrders = orders.filter((o) => o.customerId === customer.id);

  return {
    aov: calculateAOV(customerOrders),
    clv: calculateCLV(customer),
    predictedClv: calculatePredictedCLV(customer),
    purchaseFrequency: calculatePurchaseFrequency(customer),
    daysSinceLastOrder: daysSinceLastOrder(customer),
    daysSinceFirstOrder: daysSinceFirstOrder(customer),
    lifetimeValue: customer.totalSpent,
  };
}

/**
 * Calculate aggregate customer statistics
 */
export function calculateCustomerStats(
  customers: Customer[],
  orders: Order[]
): CustomerStats {
  const totalCustomers = customers.length;

  // Count by segment
  const segmentCounts = customers.reduce(
    (acc, customer) => {
      acc[customer.segment] = (acc[customer.segment] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Calculate financial metrics
  const paidOrders = orders.filter(
    (o) => o.paymentStatus === "paid" || o.paymentStatus === "refunded"
  );
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  const avgLifetimeValue = totalCustomers > 0
    ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers
    : 0;

  // Calculate average purchase frequency
  const totalFrequency = customers.reduce(
    (sum, c) => sum + calculatePurchaseFrequency(c),
    0
  );
  const avgPurchaseFrequency = totalCustomers > 0 ? totalFrequency / totalCustomers : 0;

  return {
    totalCustomers,
    newCustomers: segmentCounts.new || 0,
    returningCustomers: segmentCounts.returning || 0,
    vipCustomers: segmentCounts.vip || 0,
    atRiskCustomers: segmentCounts["at-risk"] || 0,
    churnedCustomers: segmentCounts.churned || 0,
    averageOrderValue: avgOrderValue,
    averageLifetimeValue: avgLifetimeValue,
    totalRevenue,
    averagePurchaseFrequency: avgPurchaseFrequency,
    segmentDistribution: {
      new: segmentCounts.new || 0,
      returning: segmentCounts.returning || 0,
      vip: segmentCounts.vip || 0,
      "at-risk": segmentCounts["at-risk"] || 0,
      churned: segmentCounts.churned || 0,
    },
  };
}
