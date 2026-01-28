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
import { ArrowUpDown, Eye, Mail, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Customer, CustomerSegment } from "@/types/customer";
import type { Order } from "@/types/order";
import { CustomerSegmentBadge } from "./customer-segment-badge";
import { CustomerDetailSheet } from "./customer-detail-sheet";

interface CustomersTableProps {
  customers: Customer[];
  orders: Order[];
}

export function CustomersTable({ customers, orders }: CustomersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSheetOpen(true);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Customer
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="min-w-[200px]">
            <div className="font-medium text-foreground">{customer.name}</div>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Mail className="size-3" />
              {customer.email}
            </div>
            {customer.phone && (
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Phone className="size-3" />
                {customer.phone}
              </div>
            )}
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: "segment",
      header: "Segment",
      cell: ({ row }) => {
        return (
          <div className="w-[120px]">
            <CustomerSegmentBadge segment={row.getValue("segment")} />
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
      accessorKey: "totalOrders",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Orders
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="w-[80px] text-center font-medium text-foreground">{row.getValue("totalOrders")}</div>;
      },
      size: 80,
    },
    {
      accessorKey: "totalSpent",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Total Spent
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="w-[120px] font-medium text-foreground">{formatCurrency(row.getValue("totalSpent"))}</div>;
      },
      size: 120,
    },
    {
      accessorKey: "averageOrderValue",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Avg Order
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="w-[110px] text-foreground">{formatCurrency(row.getValue("averageOrderValue"))}</div>;
      },
      size: 110,
    },
    {
      accessorKey: "lastOrderDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Last Order
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="w-[120px] text-foreground text-sm">{formatDate(row.getValue("lastOrderDate"))}</div>;
      },
      size: 120,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="w-[100px]">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(customer);
              }}
              className="gap-2"
            >
              <Eye className="size-4" />
              View
            </Button>
          </div>
        );
      },
      size: 100,
    },
  ];

  const table = useReactTable({
    data: customers,
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

  // Apply segment filter
  const handleSegmentFilterChange = (value: string) => {
    setSegmentFilter(value);
    table.getColumn("segment")?.setFilterValue(value === "all" ? "" : value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search customers..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="w-full bg-background text-white sm:max-w-sm"
        />
        <Select value={segmentFilter} onValueChange={handleSegmentFilterChange}>
          <SelectTrigger className="w-full bg-background sm:w-[180px]">
            <SelectValue placeholder="All Segments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Segments</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="returning">Returning</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="churned">Churned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <div className="hidden rounded-xl border bg-card md:block">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const customer = row.original;
            return (
              <div
                key={row.id}
                className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
                onClick={() => handleRowClick(customer)}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="font-medium text-foreground mb-1">{customer.name}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Mail className="size-3" />
                      {customer.email}
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="size-3" />
                        {customer.phone}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(customer);
                    }}
                    className="gap-2 shrink-0"
                  >
                    <Eye className="size-4" />
                    View
                  </Button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <CustomerSegmentBadge segment={customer.segment} />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Orders</div>
                    <div className="text-lg font-bold text-foreground">{customer.totalOrders}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Total Spent</div>
                    <div className="text-lg font-bold text-foreground">{formatCurrency(customer.totalSpent)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Avg Order</div>
                    <div className="text-sm font-medium text-foreground">{formatCurrency(customer.averageOrderValue)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Last Order</div>
                    <div className="text-sm font-medium text-foreground">{formatDate(customer.lastOrderDate)}</div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
            No customers found.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground flex-1 text-sm">
          Showing {table.getFilteredRowModel().rows.length} of {customers.length} customer(s)
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-background text-foreground"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-background text-foreground"
          >
            Next
          </Button>
        </div>
      </div>

      <CustomerDetailSheet
        customer={selectedCustomer}
        orders={orders}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
