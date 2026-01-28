"use client";

import { useState } from "react";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ArrowUpDown, Mail, CheckCircle2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { EmailSubscriber, SubscriptionSource } from "@/types/email-subscriber";

interface SubscribersTableProps {
  subscribers: EmailSubscriber[];
}

export function SubscribersTable({ subscribers }: SubscribersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSourceBadgeColor = (source: SubscriptionSource) => {
    const colors = {
      banner: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
      checkout: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
      manual: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
    };
    return colors[source];
  };

  const columns: ColumnDef<EmailSubscriber>[] = [
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Email
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const subscriber = row.original;
        return (
          <div className="min-w-[250px]">
            <div className="flex items-center gap-2">
              <Mail className="text-muted-foreground size-4" />
              <span className="font-medium text-foreground">{subscriber.email}</span>
            </div>
            {subscriber.customerId && (
              <div className="text-muted-foreground mt-1 text-xs">Customer ID: {subscriber.customerId}</div>
            )}
          </div>
        );
      },
      size: 250,
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => {
        const source = row.getValue("source") as SubscriptionSource;
        return (
          <div className="w-[120px]">
            <Badge className={cn("capitalize", getSourceBadgeColor(source))}>{source}</Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return row.getValue(id) === value;
      },
      size: 120,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <div className="w-[120px]">
            {isActive ? (
              <Badge className="gap-1 bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                <CheckCircle2 className="size-3" />
                Active
              </Badge>
            ) : (
              <Badge className="gap-1 bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400">
                <XCircle className="size-3" />
                Unsubscribed
              </Badge>
            )}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        if (value === "active") return row.getValue(id) === true;
        if (value === "unsubscribed") return row.getValue(id) === false;
        return true;
      },
      size: 120,
    },
    {
      accessorKey: "subscribedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Subscribed
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="w-[130px] text-foreground text-sm">{formatDate(row.getValue("subscribedAt"))}</div>;
      },
      size: 130,
    },
    {
      accessorKey: "unsubscribedAt",
      header: "Unsubscribed",
      cell: ({ row }) => {
        const date = row.getValue("unsubscribedAt") as Date | undefined;
        return (
          <div className="text-muted-foreground w-[130px] text-sm">{date ? formatDate(date) : "-"}</div>
        );
      },
      size: 130,
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = row.getValue("tags") as string[];
        if (!tags || tags.length === 0) return <div className="text-muted-foreground text-sm">-</div>;
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: subscribers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Apply filters
  const handleSourceFilterChange = (value: string) => {
    setSourceFilter(value);
    table.getColumn("source")?.setFilterValue(value === "all" ? "" : value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    table.getColumn("isActive")?.setFilterValue(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Select value={sourceFilter} onValueChange={handleSourceFilterChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="banner">Banner</SelectItem>
            <SelectItem value="checkout">Checkout</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No subscribers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground flex-1 text-sm">
          Showing {table.getFilteredRowModel().rows.length} of {subscribers.length} subscriber(s)
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
