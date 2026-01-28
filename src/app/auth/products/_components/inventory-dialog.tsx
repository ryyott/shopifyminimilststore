"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useProductStore } from "@/stores/product-store";
import type { Product } from "@/types/shop";

interface InventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function InventoryDialog({
  open,
  onOpenChange,
  product,
}: InventoryDialogProps) {
  const { updateProduct } = useProductStore();
  const [stockQuantities, setStockQuantities] = useState<Record<string, number>>({});

  if (!product) return null;

  // Initialize stock quantities from product
  const initializeStock = () => {
    const quantities: Record<string, number> = {};
    product.sizes.forEach((size) => {
      quantities[size.value] = size.stockQuantity;
    });
    setStockQuantities(quantities);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      initializeStock();
    }
    onOpenChange(newOpen);
  };

  const updateStock = (sizeValue: string, quantity: number) => {
    setStockQuantities({
      ...stockQuantities,
      [sizeValue]: Math.max(0, quantity),
    });
  };

  const handleSave = () => {
    const updatedSizes = product.sizes.map((size) => ({
      ...size,
      stockQuantity: stockQuantities[size.value] ?? size.stockQuantity,
      available: (stockQuantities[size.value] ?? size.stockQuantity) > 0,
    }));

    updateProduct(product.id, { sizes: updatedSizes });
    toast.success("Inventory updated successfully");
    onOpenChange(false);
  };

  const getTotalStock = () => {
    return product.sizes.reduce((total, size) => {
      return total + (stockQuantities[size.value] ?? size.stockQuantity);
    }, 0);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="size-5" />
            Manage Inventory - {product.name}
          </DialogTitle>
          <DialogDescription>
            Update stock quantities for each size variant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{product.code}</p>
                <p className="text-xs text-muted-foreground">{product.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Total Stock</p>
                <p className="text-2xl font-bold">{getTotalStock()}</p>
              </div>
            </div>
          </div>

          {/* Size Stock Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {product.sizes.map((size) => {
              const stockQty = stockQuantities[size.value] ?? size.stockQuantity;
              const isLowStock = stockQty > 0 && stockQty <= 3;
              const isOutOfStock = stockQty === 0;

              return (
                <div
                  key={size.value}
                  className="flex items-center justify-between rounded-lg border bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-md bg-primary/10">
                      <span className="text-sm font-bold">{size.value}</span>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Size {size.label}</Label>
                      {isOutOfStock && (
                        <Badge variant="destructive" className="mt-1">
                          Out of Stock
                        </Badge>
                      )}
                      {isLowStock && (
                        <Badge variant="outline" className="mt-1 border-orange-500 text-orange-600">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Input
                    type="number"
                    min="0"
                    value={stockQty}
                    onChange={(e) =>
                      updateStock(size.value, parseInt(e.target.value) || 0)
                    }
                    className="w-24 text-right"
                  />
                </div>
              );
            })}
          </div>

          {product.sizes.length === 0 && (
            <div className="rounded-lg border border-dashed bg-muted/50 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No sizes configured for this product
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
