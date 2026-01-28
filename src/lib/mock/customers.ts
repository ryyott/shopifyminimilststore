import { type Customer } from "@/types/customer";

// Generate consistent dates
const now = new Date("2024-02-14T12:00:00");
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
const sixMonthsAgo = new Date(now);
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
const sevenMonthsAgo = new Date(now);
sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);
const fiveDaysAgo = new Date(now);
fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
const threeDaysAgo = new Date(now);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
const twoDaysAgo = new Date(now);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);

export const mockCustomers: Customer[] = [
  // VIP Customer - Multiple orders, high spend
  {
    id: "CUST-001",
    email: "john.smith@example.com",
    name: "John Smith",
    phone: "+61 412 345 678",
    totalOrders: 5,
    totalSpent: 1247.50,
    averageOrderValue: 249.50,
    segment: "vip",
    tags: ["high-value", "frequent-buyer"],
    firstOrderDate: fourMonthsAgo,
    lastOrderDate: threeDaysAgo,
    createdAt: fourMonthsAgo,
    updatedAt: now,
  },
  // Returning Customer - Multiple orders
  {
    id: "CUST-002",
    email: "sarah.j@example.com",
    name: "Sarah Johnson",
    phone: "+61 423 456 789",
    totalOrders: 3,
    totalSpent: 847.50,
    averageOrderValue: 282.50,
    segment: "returning",
    tags: ["loyal"],
    firstOrderDate: twoMonthsAgo,
    lastOrderDate: fiveDaysAgo,
    createdAt: twoMonthsAgo,
    updatedAt: yesterday,
  },
  // New Customer - Recent first order
  {
    id: "CUST-003",
    email: "m.chen@example.com",
    name: "Michael Chen",
    phone: "+61 434 567 890",
    totalOrders: 1,
    totalSpent: 236.50,
    averageOrderValue: 236.50,
    segment: "new",
    tags: ["new-customer"],
    firstOrderDate: yesterday,
    lastOrderDate: yesterday,
    createdAt: yesterday,
    updatedAt: yesterday,
  },
  // New Customer - Just placed order
  {
    id: "CUST-004",
    email: "emma.davis@example.com",
    name: "Emma Davis",
    phone: "+61 445 678 901",
    totalOrders: 1,
    totalSpent: 258.50,
    averageOrderValue: 258.50,
    segment: "new",
    tags: ["new-customer"],
    firstOrderDate: now,
    lastOrderDate: now,
    createdAt: now,
    updatedAt: now,
  },
  // Churned Customer - No order in 6 months
  {
    id: "CUST-005",
    email: "j.wilson@example.com",
    name: "James Wilson",
    phone: "+61 456 789 012",
    totalOrders: 2,
    totalSpent: 425.00,
    averageOrderValue: 212.50,
    segment: "churned",
    tags: ["inactive"],
    firstOrderDate: sevenMonthsAgo,
    lastOrderDate: sixMonthsAgo,
    createdAt: sevenMonthsAgo,
    updatedAt: sixMonthsAgo,
  },
  // Returning Customer
  {
    id: "CUST-006",
    email: "olivia.b@example.com",
    name: "Olivia Brown",
    phone: "+61 467 890 123",
    totalOrders: 4,
    totalSpent: 956.00,
    averageOrderValue: 239.00,
    segment: "returning",
    tags: ["loyal", "satisfied"],
    firstOrderDate: threeMonthsAgo,
    lastOrderDate: fiveDaysAgo,
    createdAt: threeMonthsAgo,
    updatedAt: twoDaysAgo,
  },
  // VIP Customer - High value
  {
    id: "CUST-007",
    email: "w.taylor@example.com",
    name: "William Taylor",
    phone: "+61 478 901 234",
    totalOrders: 6,
    totalSpent: 1542.50,
    averageOrderValue: 257.08,
    segment: "vip",
    tags: ["high-value", "frequent-buyer", "premium"],
    firstOrderDate: fiveMonthsAgo,
    lastOrderDate: twoDaysAgo,
    createdAt: fiveMonthsAgo,
    updatedAt: now,
  },
  // New Customer
  {
    id: "CUST-008",
    email: "sophia.m@example.com",
    name: "Sophia Martinez",
    phone: "+61 489 012 345",
    totalOrders: 1,
    totalSpent: 115.50,
    averageOrderValue: 115.50,
    segment: "new",
    tags: ["new-customer"],
    firstOrderDate: yesterday,
    lastOrderDate: yesterday,
    createdAt: yesterday,
    updatedAt: yesterday,
  },
  // At-Risk Customer - No order in 3 months
  {
    id: "CUST-009",
    email: "david.lee@example.com",
    name: "David Lee",
    phone: "+61 490 123 456",
    totalOrders: 3,
    totalSpent: 678.00,
    averageOrderValue: 226.00,
    segment: "at-risk",
    tags: ["needs-attention"],
    firstOrderDate: fiveMonthsAgo,
    lastOrderDate: threeMonthsAgo,
    createdAt: fiveMonthsAgo,
    updatedAt: threeMonthsAgo,
  },
  // Returning Customer
  {
    id: "CUST-010",
    email: "emily.white@example.com",
    name: "Emily White",
    phone: "+61 401 234 567",
    totalOrders: 2,
    totalSpent: 445.00,
    averageOrderValue: 222.50,
    segment: "returning",
    tags: ["repeat-buyer"],
    firstOrderDate: twoMonthsAgo,
    lastOrderDate: oneMonthAgo,
    createdAt: twoMonthsAgo,
    updatedAt: oneMonthAgo,
  },
  // VIP Customer
  {
    id: "CUST-011",
    email: "daniel.garcia@example.com",
    name: "Daniel Garcia",
    phone: "+61 412 345 789",
    totalOrders: 8,
    totalSpent: 1856.00,
    averageOrderValue: 232.00,
    segment: "vip",
    tags: ["high-value", "frequent-buyer", "vip"],
    firstOrderDate: sixMonthsAgo,
    lastOrderDate: oneMonthAgo,
    createdAt: sixMonthsAgo,
    updatedAt: oneMonthAgo,
  },
  // At-Risk Customer
  {
    id: "CUST-012",
    email: "rachel.kim@example.com",
    name: "Rachel Kim",
    phone: "+61 423 456 890",
    totalOrders: 2,
    totalSpent: 512.00,
    averageOrderValue: 256.00,
    segment: "at-risk",
    tags: ["needs-attention"],
    firstOrderDate: fourMonthsAgo,
    lastOrderDate: threeMonthsAgo,
    createdAt: fourMonthsAgo,
    updatedAt: threeMonthsAgo,
  },
];
