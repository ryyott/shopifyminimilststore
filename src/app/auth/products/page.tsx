"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, FileDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useProductStore } from "@/stores/product-store";
import type { Product } from "@/types/shop";

import { ProductsTable } from "./_components/products-table";
import { ProductFormDialog } from "./_components/product-form-dialog";
import { InventoryDialog } from "./_components/inventory-dialog";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { products, deleteProduct, duplicateProduct } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [inventoryProduct, setInventoryProduct] = useState<Product | null>(null);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);

  // Check for add param and open dialog
  useEffect(() => {
    if (searchParams.get("add") === "true") {
      handleAdd();
      // Clear the URL param
      window.history.replaceState({}, "", "/auth/products");
    }
  }, [searchParams]);

  const handleAdd = () => {
    setSelectedProduct(null);
    setDialogMode("add");
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleDuplicate = (product: Product) => {
    duplicateProduct(product.id);
    toast.success(`Product "${product.name}" duplicated successfully`);
  };

  const handleDelete = (product: Product) => {
    if (
      confirm(
        `Are you sure you want to delete "${product.name}"? This cannot be undone.`
      )
    ) {
      deleteProduct(product.id);
      toast.success(`Product "${product.name}" deleted successfully`);
    }
  };

  const handleManageInventory = (product: Product) => {
    setInventoryProduct(product);
    setIsInventoryDialogOpen(true);
  };

  const handleExport = () => {
    // Convert products to CSV
    const headers = [
      "ID",
      "Code",
      "Name",
      "Price",
      "Category",
      "Stock",
      "Featured",
      "Date Added",
    ];
    const rows = products.map((p) => [
      p.id,
      p.code,
      p.name,
      p.price,
      p.category,
      p.inStock ? "In Stock" : "Out of Stock",
      p.featured ? "Yes" : "No",
      p.dateAdded,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Products exported successfully");
  };

  // Calculate stats
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;
  const featuredCount = products.filter((p) => p.featured).length;

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Products
          </h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <FileDown className="size-4 text-foreground" />
            <span className="hidden text-foreground sm:inline">Export</span>
          </Button>
          <Button className="gap-2" onClick={handleAdd}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add Product</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Total Products
              </p>
              <p className="text-foreground text-2xl font-bold">
                {totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                In Stock
              </p>
              <p className="text-foreground text-2xl font-bold">
                {inStockCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Out of Stock
              </p>
              <p className="text-foreground text-2xl font-bold">
                {outOfStockCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Featured
              </p>
              <p className="text-foreground text-2xl font-bold">
                {featuredCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <ProductsTable
        products={products}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onManageInventory={handleManageInventory}
      />

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        mode={dialogMode}
      />

      {/* Inventory Dialog */}
      <InventoryDialog
        open={isInventoryDialogOpen}
        onOpenChange={setIsInventoryDialogOpen}
        product={inventoryProduct}
      />
    </div>
  );
}
