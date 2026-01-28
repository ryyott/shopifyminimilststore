import type { EmailSubscriber, EmailSubscriberStats } from "@/types/email-subscriber";
import type { Customer } from "@/types/customer";
import { daysBetween } from "./customer-metrics";

/**
 * Calculate email subscriber statistics
 */
export function calculateEmailSubscriberStats(
  subscribers: EmailSubscriber[],
  customers: Customer[]
): EmailSubscriberStats {
  const now = new Date();

  // Total counts
  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter((s) => s.isActive).length;
  const unsubscribed = subscribers.filter((s) => !s.isActive).length;

  // Growth metrics - last 7 days
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newSubscribersLast7Days = subscribers.filter(
    (s) => s.subscribedAt >= sevenDaysAgo && s.isActive
  ).length;

  // Growth metrics - last 30 days
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newSubscribersLast30Days = subscribers.filter(
    (s) => s.subscribedAt >= thirtyDaysAgo && s.isActive
  ).length;

  // Calculate growth rates
  const subscribersBefore7Days = subscribers.filter(
    (s) => s.subscribedAt < sevenDaysAgo
  ).length;
  const growthRate7d =
    subscribersBefore7Days > 0
      ? (newSubscribersLast7Days / subscribersBefore7Days) * 100
      : 0;

  const subscribersBefore30Days = subscribers.filter(
    (s) => s.subscribedAt < thirtyDaysAgo
  ).length;
  const growthRate30d =
    subscribersBefore30Days > 0
      ? (newSubscribersLast30Days / subscribersBefore30Days) * 100
      : 0;

  // Source breakdown
  const sourceBreakdown = subscribers.reduce(
    (acc, subscriber) => {
      if (subscriber.isActive) {
        acc[subscriber.source] = (acc[subscriber.source] || 0) + 1;
      }
      return acc;
    },
    { banner: 0, checkout: 0, manual: 0 }
  );

  // Conversion rate (subscribers who became customers)
  const subscribersWhoPurchased = subscribers.filter(
    (s) => s.customerId !== undefined && s.customerId !== null
  ).length;
  const conversionRate =
    totalSubscribers > 0 ? (subscribersWhoPurchased / totalSubscribers) * 100 : 0;

  return {
    totalSubscribers,
    activeSubscribers,
    unsubscribed,
    newSubscribersLast7Days,
    newSubscribersLast30Days,
    growthRate7d,
    growthRate30d,
    sourceBreakdown,
    subscribersWhoPurchased,
    conversionRate,
  };
}

/**
 * Get subscribers grouped by date for charts
 */
export function getSubscriberGrowthData(
  subscribers: EmailSubscriber[],
  days: number = 30
): Array<{ date: Date; count: number }> {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);

  // Create array of dates
  const dateArray: Date[] = [];
  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dateArray.push(date);
  }

  // Count subscribers for each date (cumulative)
  return dateArray.map((date) => {
    const count = subscribers.filter(
      (s) => s.subscribedAt <= date && s.isActive
    ).length;
    return { date, count };
  });
}

/**
 * Get new subscribers by date range
 */
export function getNewSubscribersByDateRange(
  subscribers: EmailSubscriber[],
  startDate: Date,
  endDate: Date
): EmailSubscriber[] {
  return subscribers.filter(
    (s) =>
      s.subscribedAt >= startDate &&
      s.subscribedAt <= endDate &&
      s.isActive
  );
}

/**
 * Get unsubscribe rate over time period
 */
export function calculateUnsubscribeRate(
  subscribers: EmailSubscriber[],
  days: number = 30
): number {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);

  const unsubscribedInPeriod = subscribers.filter(
    (s) =>
      s.unsubscribedAt &&
      s.unsubscribedAt >= startDate &&
      s.unsubscribedAt <= now
  ).length;

  const totalAtStartOfPeriod = subscribers.filter(
    (s) => s.subscribedAt < startDate
  ).length;

  return totalAtStartOfPeriod > 0
    ? (unsubscribedInPeriod / totalAtStartOfPeriod) * 100
    : 0;
}

/**
 * Get engagement metrics
 */
export function getEngagementMetrics(
  subscribers: EmailSubscriber[],
  customers: Customer[]
) {
  const activeSubscribers = subscribers.filter((s) => s.isActive);

  // Subscribers who are also customers (engaged)
  const engagedSubscribers = activeSubscribers.filter(
    (s) => s.customerId !== undefined && s.customerId !== null
  );

  // Subscribers who haven't purchased (prospects)
  const prospects = activeSubscribers.filter(
    (s) => s.customerId === undefined || s.customerId === null
  );

  return {
    totalActive: activeSubscribers.length,
    engagedCount: engagedSubscribers.length,
    prospectCount: prospects.length,
    engagementRate:
      activeSubscribers.length > 0
        ? (engagedSubscribers.length / activeSubscribers.length) * 100
        : 0,
  };
}

/**
 * Filter subscribers by source
 */
export function filterBySource(
  subscribers: EmailSubscriber[],
  source: "banner" | "checkout" | "manual" | "all"
): EmailSubscriber[] {
  if (source === "all") return subscribers;
  return subscribers.filter((s) => s.source === source);
}

/**
 * Filter subscribers by status
 */
export function filterByStatus(
  subscribers: EmailSubscriber[],
  status: "active" | "unsubscribed" | "all"
): EmailSubscriber[] {
  if (status === "all") return subscribers;
  if (status === "active") return subscribers.filter((s) => s.isActive);
  return subscribers.filter((s) => !s.isActive);
}
