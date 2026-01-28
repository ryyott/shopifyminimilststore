"use client";

import { useState } from "react";
import { Users } from "lucide-react";

import { mockCustomers } from "@/lib/mock/customers";
import { mockOrders } from "@/lib/mock/orders";
import { CustomerStatsCards } from "./_components/customer-stats-cards";
import { CustomersTable } from "./_components/customers-table";

export default function CustomersPage() {
  const [customers] = useState(mockCustomers);
  const [orders] = useState(mockOrders);

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/30">
          <Users className="size-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Customers</h1>
          <p className="text-muted-foreground text-sm">Manage and view customer information</p>
        </div>
      </div>

      <CustomerStatsCards customers={customers} orders={orders} />

      <CustomersTable customers={customers} orders={orders} />
    </div>
  );
}
