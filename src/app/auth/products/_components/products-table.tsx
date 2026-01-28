"use client";

import { useState } from "react";
import Image from "next/image";

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
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Star,
  Package,
} from "lucide-react";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Product, Category } from "@/types/shop";

interface ProductsTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDuplicate?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onManageInventory?: (product: Product) => void;
}

export function ProductsTable({
  products,
  onEdit,
  onDuplicate,
  onDelete,
  onManageInventory,
}: ProductsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "dateAdded", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");

  const formatDate = (date: string) => {
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

  const getCategoryColor = (category: Category) => {
    const colors = {
      new: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
      mens: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
      womens:
        "bg-pink-100 text-pink-700 dark:bg-pink-950/30 dark:text-pink-400",
      slides:
        "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
      accessories:
        "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
    };
    return colors[category];
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Product
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex min-w-[250px] items-center gap-3">
            <div className="relative size-10 overflow-hidden rounded-md bg-muted">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div>
              <div className="font-medium text-foreground">{product.name}</div>
              <div className="text-muted-foreground text-xs">
                {product.code}
              </div>
            </div>
          </div>
        );
      },
      size: 250,
    },
    {
      accessorKey: "code",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Code
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="w-[100px] font-mono text-sm text-foreground">
          {row.getValue("code")}
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as Category;
        return (
          <div className="w-[120px]">
            <Badge className={cn("capitalize", getCategoryColor(category))}>
              {category}
            </Badge>
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
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Price
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="w-[100px] font-medium text-foreground">
          {formatCurrency(row.getValue("price"))}
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "inStock",
      header: "Stock",
      cell: ({ row }) => {
        const inStock = row.getValue("inStock") as boolean;
        return (
          <div className="w-[100px]">
            <Badge
              className={cn(
                inStock
                  ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
              )}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        if (value === "inStock") return row.getValue(id) === true;
        if (value === "outOfStock") return row.getValue(id) === false;
        return true;
      },
      size: 100,
    },
    {
      id: "sizes",
      header: "Sizes",
      cell: ({ row }) => {
        const sizes = row.original.sizes;
        const availableSizes = sizes.filter((s) => s.available);
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-[120px] cursor-help text-sm text-muted-foreground">
                  {sizes.length} size{sizes.length !== 1 ? "s" : ""}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="font-medium">Available sizes:</p>
                  <p className="text-xs">
                    {availableSizes.length > 0
                      ? availableSizes.map((s) => s.label).join(", ")
                      : "None available"}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
      size: 120,
    },
    {
      accessorKey: "featured",
      header: "Featured",
      cell: ({ row }) => {
        const featured = row.getValue("featured") as boolean;
        return (
          <div className="w-[80px]">
            {featured ? (
              <Star className="size-4 fill-yellow-500 text-yellow-500" />
            ) : (
              <Star className="size-4 text-muted-foreground" />
            )}
          </div>
        );
      },
      size: 80,
    },
    {
      accessorKey: "dateAdded",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Date Added
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="w-[120px] text-sm text-foreground">
          {formatDate(row.getValue("dateAdded"))}
        </div>
      ),
      size: 120,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const product = row.original;

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
                <DropdownMenuItem onClick={() => onEdit?.(product)}>
                  <Pencil className="mr-2 size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onManageInventory?.(product)}>
                  <Package className="mr-2 size-4" />
                  Manage Inventory
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate?.(product)}>
                  <Copy className="mr-2 size-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete?.(product)}
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
    data: products,
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

  // Apply category filter
  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    if (value === "all") {
      table.getColumn("category")?.setFilterValue(undefined);
    } else {
      table.getColumn("category")?.setFilterValue(value);
    }
  };

  // Apply stock filter
  const handleStockFilterChange = (value: string) => {
    setStockFilter(value);
    table.getColumn("inStock")?.setFilterValue(value);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by name or code..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="w-full bg-background text-white sm:max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
          <SelectTrigger className="w-full bg-background sm:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="mens">Mens</SelectItem>
            <SelectItem value="womens">Womens</SelectItem>
            <SelectItem value="slides">Slides</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={handleStockFilterChange}>
          <SelectTrigger className="w-full bg-background sm:w-[180px]">
            <SelectValue placeholder="All Stock Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock Status</SelectItem>
            <SelectItem value="inStock">In Stock</SelectItem>
            <SelectItem value="outOfStock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <div className="hidden rounded-xl border bg-card md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="h-14 font-medium text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                  className="cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/30"
                  onClick={(e) => {
                    // Don't trigger if clicking on action buttons
                    const target = e.target as HTMLElement;
                    if (
                      !target.closest('[role="menuitem"]') &&
                      !target.closest("button")
                    ) {
                      onEdit?.(row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  No products found.
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
            const product = row.original;
            const availableSizes = product.sizes.filter((s) => s.available);
            return (
              <div
                key={row.id}
                className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/30"
                onClick={() => onEdit?.(product)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative size-16 overflow-hidden rounded-md bg-muted shrink-0">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground mb-1">{product.name}</div>
                    <div className="text-xs text-muted-foreground font-mono mb-2">{product.code}</div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("capitalize", getCategoryColor(product.category))}>
                        {product.category}
                      </Badge>
                      <Badge
                        className={cn(
                          product.inStock
                            ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                        )}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                      {product.featured && (
                        <Star className="size-4 fill-yellow-500 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="size-8 p-0 shrink-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(product); }}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onManageInventory?.(product); }}>
                        <Package className="mr-2 size-4" />
                        Manage Inventory
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate?.(product); }}>
                        <Copy className="mr-2 size-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => { e.stopPropagation(); onDelete?.(product); }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Price</div>
                    <div className="text-lg font-bold text-foreground">{formatCurrency(product.price)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Sizes</div>
                    <div className="text-sm font-medium text-foreground">{product.sizes.length} size{product.sizes.length !== 1 ? "s" : ""}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Added</div>
                    <div className="text-sm font-medium text-foreground">{formatDate(product.dateAdded)}</div>
                  </div>
                </div>

                {availableSizes.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground mb-1">Available sizes:</div>
                    <div className="text-xs text-foreground">{availableSizes.map((s) => s.label).join(", ")}</div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
            No products found.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-muted-foreground">
          {table.getFilteredRowModel().rows.length} product(s) found
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
    </div>
  );
}
