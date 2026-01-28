import type { Customer, CustomerSegment } from "@/types/customer";
import { daysBetween } from "./customer-metrics";

/**
 * Determine customer segment based on purchase behavior
 *
 * Segments:
 * - New: 0-1 orders, active within last 90 days
 * - Returning: Multiple orders, active
 * - VIP: High spend ($1000+) or frequent (5+ orders)
 * - At-Risk: No order in 90-180 days
 * - Churned: No order in 180+ days
 */
export function segmentCustomer(customer: Customer): CustomerSegment {
  const now = new Date();
  const daysSinceLast = customer.lastOrderDate
    ? daysBetween(customer.lastOrderDate, now)
    : null;

  // Churned: No order in 180+ days (6 months)
  if (daysSinceLast !== null && daysSinceLast > 180) {
    return "churned";
  }

  // At-Risk: No order in 90-180 days (3-6 months)
  if (daysSinceLast !== null && daysSinceLast > 90 && daysSinceLast <= 180) {
    return "at-risk";
  }

  // VIP: High value ($1000+) or frequent buyer (5+ orders)
  if (customer.totalSpent >= 1000 || customer.totalOrders >= 5) {
    return "vip";
  }

  // New: 0-1 orders and active within last 90 days
  if (customer.totalOrders <= 1 && (daysSinceLast === null || daysSinceLast <= 90)) {
    return "new";
  }

  // Returning: Default for active customers with multiple orders
  return "returning";
}

/**
 * Get segment label for display
 */
export function getSegmentLabel(segment: CustomerSegment): string {
  const labels: Record<CustomerSegment, string> = {
    new: "New",
    returning: "Returning",
    vip: "VIP",
    "at-risk": "At Risk",
    churned: "Churned",
  };

  return labels[segment];
}

/**
 * Get segment description
 */
export function getSegmentDescription(segment: CustomerSegment): string {
  const descriptions: Record<CustomerSegment, string> = {
    new: "Recent first-time customer",
    returning: "Active repeat customer",
    vip: "High-value or frequent buyer",
    "at-risk": "Inactive for 3-6 months",
    churned: "Inactive for 6+ months",
  };

  return descriptions[segment];
}

/**
 * Get segment color for UI badges
 */
export function getSegmentColor(
  segment: CustomerSegment
): {
  bg: string;
  text: string;
  border: string;
} {
  const colors: Record<
    CustomerSegment,
    { bg: string; text: string; border: string }
  > = {
    new: {
      bg: "bg-blue-50 dark:bg-blue-950",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
    },
    returning: {
      bg: "bg-green-50 dark:bg-green-950",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-200 dark:border-green-800",
    },
    vip: {
      bg: "bg-purple-50 dark:bg-purple-950",
      text: "text-purple-700 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-800",
    },
    "at-risk": {
      bg: "bg-yellow-50 dark:bg-yellow-950",
      text: "text-yellow-700 dark:text-yellow-300",
      border: "border-yellow-200 dark:border-yellow-800",
    },
    churned: {
      bg: "bg-gray-50 dark:bg-gray-950",
      text: "text-gray-700 dark:text-gray-300",
      border: "border-gray-200 dark:border-gray-800",
    },
  };

  return colors[segment];
}

/**
 * Filter customers by segment
 */
export function filterBySegment(
  customers: Customer[],
  segment: CustomerSegment | "all"
): Customer[] {
  if (segment === "all") return customers;
  return customers.filter((c) => c.segment === segment);
}

/**
 * Sort customers by various criteria
 */
export function sortCustomers(
  customers: Customer[],
  sortBy: "name" | "totalSpent" | "totalOrders" | "lastOrder" | "segment"
): Customer[] {
  const sorted = [...customers];

  switch (sortBy) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case "totalSpent":
      return sorted.sort((a, b) => b.totalSpent - a.totalSpent);

    case "totalOrders":
      return sorted.sort((a, b) => b.totalOrders - a.totalOrders);

    case "lastOrder":
      return sorted.sort((a, b) => {
        if (!a.lastOrderDate) return 1;
        if (!b.lastOrderDate) return -1;
        return b.lastOrderDate.getTime() - a.lastOrderDate.getTime();
      });

    case "segment":
      // Sort by segment priority: VIP > Returning > New > At-Risk > Churned
      const segmentPriority: Record<CustomerSegment, number> = {
        vip: 1,
        returning: 2,
        new: 3,
        "at-risk": 4,
        churned: 5,
      };
      return sorted.sort(
        (a, b) => segmentPriority[a.segment] - segmentPriority[b.segment]
      );

    default:
      return sorted;
  }
}
