export type SubscriptionSource = "banner" | "checkout" | "manual";

export interface EmailSubscriber {
  id: string;
  email: string;
  source: SubscriptionSource;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  isActive: boolean;
  tags: string[];

  // Optional link to customer if they made a purchase
  customerId?: string;
}

export interface EmailSubscriberStats {
  // Totals
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribed: number;

  // Growth metrics
  newSubscribersLast7Days: number;
  newSubscribersLast30Days: number;
  growthRate7d: number;
  growthRate30d: number;

  // Source breakdown
  sourceBreakdown: Record<SubscriptionSource, number>;

  // Conversion
  subscribersWhoPurchased: number;
  conversionRate: number;
}
