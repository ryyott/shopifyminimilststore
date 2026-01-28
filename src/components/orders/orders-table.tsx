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
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Copy, Trash2, DollarSign, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";

import { OrderStatusBadge } from "./order-status-badge";
import { DetailedOrderTimeline, OrderTimeline } from "./order-timeline";

interface OrdersTableProps {
  orders: Order[];
  onView?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onDuplicate?: (order: Order) => void;
  onDelete?: (order: Order) => void;
}

export function OrdersTable({ orders, onView, onEdit, onDuplicate, onDelete }: OrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const formatDate = (date: Date) => {
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

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "orderId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Order ID
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="w-[120px] font-medium text-foreground">{row.getValue("orderId")}</div>,
      size: 120,
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="min-w-[200px]">
            <div className="font-medium text-foreground">{order.customerName}</div>
            <div className="text-muted-foreground text-xs">{order.customerEmail}</div>
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: "status",
      header: "Order Status",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <div className="w-[140px] cursor-pointer">
                <OrderStatusBadge status={row.getValue("status")} />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Order Progress</h4>
                <OrderTimeline events={order.events} />
              </div>
            </PopoverContent>
          </Popover>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return row.getValue(id) === value;
      },
      size: 140,
    },
    {
      id: "timeline",
      header: "Order Event",
      cell: ({ row }) => {
        const order = row.original;
        const formatDateTime = (date: Date) => {
          return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          });
        };

        return (
          <HoverCard openDelay={200}>
            <HoverCardTrigger asChild>
              <div className="min-w-[200px] cursor-help">
                <OrderTimeline events={order.events} className="ml-2" />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-96" side="right" align="center" sideOffset={5} alignOffset={0} collisionPadding={{ top: 20, bottom: 80, left: 20, right: 20 }}>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">{order.orderId}</h4>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-muted-foreground text-xs">{order.customerName}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-medium">{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-medium">{order.items.length} item(s)</span>
                  </div>
                  {order.trackingNumber && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Tracking</span>
                      <span className="font-mono text-xs font-medium">{order.trackingNumber}</span>
                    </div>
                  )}
                  {order.expectedDelivery && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Expected Delivery</span>
                      <span className="font-medium">{formatDateTime(order.expectedDelivery)}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 border-t pt-3">
                  <h5 className="text-muted-foreground text-xs font-semibold">Progress Timeline</h5>
                  <DetailedOrderTimeline events={order.events} />
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      },
      size: 200,
    },
    {
      accessorKey: "total",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Total
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="w-[110px] font-medium text-foreground">{formatCurrency(row.getValue("total"))}</div>;
      },
      size: 110,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Date
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="w-[120px] text-foreground text-sm">{formatDate(row.getValue("createdAt"))}</div>;
      },
      size: 120,
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => {
        const paymentStatus = row.getValue("paymentStatus") as string;
        const statusColors = {
          paid: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
          pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
          failed: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
          refunded: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
        };
        return (
          <div className="w-[100px]">
            <Badge className={cn("capitalize", statusColors[paymentStatus as keyof typeof statusColors])}>
              {paymentStatus}
            </Badge>
          </div>
        );
      },
      size: 100,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex w-[50px] justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onView?.(order)}>
                  <Eye className="mr-2 size-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(order)}>
                  <Pencil className="mr-2 size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate?.(order)}>
                  <Copy className="mr-2 size-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete?.(order)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 50,
    },
  ];

  const table = useReactTable({
    data: orders,
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
  });

  // Apply status filter
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    if (value === "all") {
      table.getColumn("status")?.setFilterValue(undefined);
    } else {
      table.getColumn("status")?.setFilterValue(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by order ID or customer..."
          value={(table.getColumn("orderId")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("orderId")?.setFilterValue(event.target.value)}
          className="w-full bg-background text-white sm:max-w-sm"
        />
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-full bg-background sm:w-[180px]">
            <SelectValue placeholder="All Order Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Order Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <div className="hidden rounded-xl border bg-card md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-14 text-muted-foreground font-medium">
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
                  className="cursor-pointer border-b last:border-0 transition-colors hover:bg-muted/30"
                  onClick={(e) => {
                    // Don't trigger if clicking on action buttons
                    const target = e.target as HTMLElement;
                    if (!target.closest('[role="menuitem"]') && !target.closest("button")) {
                      onView?.(row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  No orders found.
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
            const order = row.original;
            return (
              <div
                key={row.id}
                className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/30"
                onClick={() => onView?.(order)}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="font-medium text-foreground mb-1">{order.orderId}</div>
                    <div className="text-sm text-muted-foreground">{order.customerName}</div>
                    <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView?.(order); }}>
                        <Eye className="mr-2 size-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(order); }}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate?.(order); }}>
                        <Copy className="mr-2 size-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => { e.stopPropagation(); onDelete?.(order); }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Status</div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Payment</div>
                    <Badge className={cn("capitalize", {
                      "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400": order.paymentStatus === "paid",
                      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400": order.paymentStatus === "pending",
                      "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400": order.paymentStatus === "failed",
                      "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400": order.paymentStatus === "refunded",
                    })}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="font-medium text-foreground">{formatCurrency(order.total)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Date</div>
                    <div className="text-sm text-foreground">{formatDate(order.createdAt)}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-muted-foreground mb-2">Progress</div>
                  <OrderTimeline events={order.events} className="ml-2" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
            No orders found.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm font-medium">{table.getFilteredRowModel().rows.length} order(s) found</div>
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
    </div>
  );
}
