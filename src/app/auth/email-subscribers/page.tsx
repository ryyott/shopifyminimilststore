"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

import { mockEmailSubscribers } from "@/lib/mock/email-subscribers";
import { mockCustomers } from "@/lib/mock/customers";
import { SubscriberStatsCards } from "./_components/subscriber-stats-cards";
import { SubscribersTable } from "./_components/subscribers-table";
import { SubscriberGrowthChart } from "./_components/subscriber-growth-chart";

export default function EmailSubscribersPage() {
  const [subscribers] = useState(mockEmailSubscribers);
  const [customers] = useState(mockCustomers);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/30">
          <Mail className="size-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email Subscribers</h1>
          <p className="text-muted-foreground text-sm">Manage your email list and track growth</p>
        </div>
      </div>

      <SubscriberStatsCards subscribers={subscribers} customers={customers} />

      <SubscriberGrowthChart subscribers={subscribers} days={30} />

      <SubscribersTable subscribers={subscribers} />
    </div>
  );
}
