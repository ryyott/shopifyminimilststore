import { type EmailSubscriber } from "@/types/email-subscriber";

// Generate consistent dates
const now = new Date("2024-02-14T12:00:00");
const oneWeekAgo = new Date(now);
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
const twoWeeksAgo = new Date(now);
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
const threeWeeksAgo = new Date(now);
threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
const oneMonthAgo = new Date(now);
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
const twoMonthsAgo = new Date(now);
twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
const threeMonthsAgo = new Date(now);
threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
const fourMonthsAgo = new Date(now);
fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
const fiveMonthsAgo = new Date(now);
fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

export const mockEmailSubscribers: EmailSubscriber[] = [
  // Customers who also subscribed (linked to customer IDs)
  {
    id: "SUB-001",
    email: "john.smith@example.com",
    source: "checkout",
    subscribedAt: fourMonthsAgo,
    isActive: true,
    tags: ["customer", "vip"],
    customerId: "CUST-001",
  },
  {
    id: "SUB-002",
    email: "sarah.j@example.com",
    source: "checkout",
    subscribedAt: twoMonthsAgo,
    isActive: true,
    tags: ["customer"],
    customerId: "CUST-002",
  },
  {
    id: "SUB-003",
    email: "olivia.b@example.com",
    source: "banner",
    subscribedAt: threeMonthsAgo,
    isActive: true,
    tags: ["customer", "engaged"],
    customerId: "CUST-006",
  },
  {
    id: "SUB-004",
    email: "w.taylor@example.com",
    source: "checkout",
    subscribedAt: fiveMonthsAgo,
    isActive: true,
    tags: ["customer", "vip"],
    customerId: "CUST-007",
  },
  {
    id: "SUB-005",
    email: "emily.white@example.com",
    source: "checkout",
    subscribedAt: twoMonthsAgo,
    isActive: true,
    tags: ["customer"],
    customerId: "CUST-010",
  },
  // Newsletter subscribers who haven't purchased yet
  {
    id: "SUB-006",
    email: "alex.turner@example.com",
    source: "banner",
    subscribedAt: oneMonthAgo,
    isActive: true,
    tags: ["prospect"],
  },
  {
    id: "SUB-007",
    email: "lisa.anderson@example.com",
    source: "banner",
    subscribedAt: threeWeeksAgo,
    isActive: true,
    tags: ["prospect"],
  },
  {
    id: "SUB-008",
    email: "mark.roberts@example.com",
    source: "manual",
    subscribedAt: twoMonthsAgo,
    isActive: true,
    tags: ["prospect", "referral"],
  },
  {
    id: "SUB-009",
    email: "jessica.lopez@example.com",
    source: "banner",
    subscribedAt: oneWeekAgo,
    isActive: true,
    tags: ["prospect"],
  },
  {
    id: "SUB-010",
    email: "chris.evans@example.com",
    source: "banner",
    subscribedAt: twoWeeksAgo,
    isActive: true,
    tags: ["prospect"],
  },
  {
    id: "SUB-011",
    email: "amanda.clark@example.com",
    source: "manual",
    subscribedAt: fourMonthsAgo,
    isActive: true,
    tags: ["prospect", "vip-list"],
  },
  {
    id: "SUB-012",
    email: "thomas.moore@example.com",
    source: "banner",
    subscribedAt: oneWeekAgo,
    isActive: true,
    tags: ["prospect"],
  },
  {
    id: "SUB-013",
    email: "nicole.harris@example.com",
    source: "checkout",
    subscribedAt: threeMonthsAgo,
    isActive: true,
    tags: ["prospect"],
  },
  {
    id: "SUB-014",
    email: "kevin.martin@example.com",
    source: "banner",
    subscribedAt: twoWeeksAgo,
    isActive: true,
    tags: ["prospect"],
  },
  // Some unsubscribed users
  {
    id: "SUB-015",
    email: "patrick.wilson@example.com",
    source: "banner",
    subscribedAt: fiveMonthsAgo,
    unsubscribedAt: twoMonthsAgo,
    isActive: false,
    tags: ["unsubscribed"],
  },
  {
    id: "SUB-016",
    email: "laura.thompson@example.com",
    source: "checkout",
    subscribedAt: fourMonthsAgo,
    unsubscribedAt: oneMonthAgo,
    isActive: false,
    tags: ["unsubscribed"],
  },
  // Recent subscribers (last 7 days)
  {
    id: "SUB-017",
    email: "ryan.jackson@example.com",
    source: "banner",
    subscribedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isActive: true,
    tags: ["prospect", "recent"],
  },
  {
    id: "SUB-018",
    email: "michelle.lee@example.com",
    source: "banner",
    subscribedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    isActive: true,
    tags: ["prospect", "recent"],
  },
  {
    id: "SUB-019",
    email: "brandon.hill@example.com",
    source: "checkout",
    subscribedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isActive: true,
    tags: ["prospect", "recent"],
  },
  {
    id: "SUB-020",
    email: "stephanie.scott@example.com",
    source: "banner",
    subscribedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    isActive: true,
    tags: ["prospect", "recent"],
  },
];
