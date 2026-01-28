"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useProductStore } from "@/stores/product-store";
import type { Product, Category } from "@/types/shop";

import { SizeSelector } from "./size-selector";
import { ImageInput } from "./image-input";

const productFormSchema = z.object({
  code: z
    .string()
    .min(2, "Product code must be at least 2 characters")
    .max(20, "Product code must be less than 20 characters"),
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must be less than 100 characters"),
  slug: z.string().optional(),
  category: z.enum(["new", "mens", "womens", "slides", "accessories"]),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  images: z.array(z.string()).min(1, "At least one image is required").max(4, "Maximum 4 images allowed"),
  sizes: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        available: z.boolean(),
        stockQuantity: z.number().min(0, "Stock quantity must be at least 0"),
      })
    )
    .min(1, "At least one size is required"),
  inStock: z.boolean(),
  featured: z.boolean(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  mode: "add" | "edit";
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  mode,
}: ProductFormDialogProps) {
  const { addProduct, updateProduct } = useProductStore();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      code: "",
      name: "",
      slug: "",
      category: "new",
      price: 0,
      description: "",
      images: [""],
      sizes: [],
      inStock: true,
      featured: false,
    },
  });

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (open && mode === "edit" && product) {
      form.reset({
        code: product.code,
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: product.price,
        description: product.description || "",
        images: product.images,
        sizes: product.sizes,
        inStock: product.inStock,
        featured: product.featured,
      });
    } else if (open && mode === "add") {
      form.reset({
        code: "",
        name: "",
        slug: "",
        category: "new",
        price: 0,
        description: "",
        images: [""],
        sizes: [],
        inStock: true,
        featured: false,
      });
    }
  }, [open, mode, product, form]);

  const onSubmit = (data: ProductFormValues) => {
    try {
      const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      if (mode === "add") {
        addProduct({
          ...data,
          slug,
          dateAdded: new Date().toISOString().split('T')[0],
        });
        toast.success("Product added successfully");
      } else if (product) {
        updateProduct(product.id, { ...data, slug });
        toast.success("Product updated successfully");
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to save product");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-none bg-background p-0 shadow-2xl">
        <DialogHeader className="space-y-2 border-b border-border bg-gradient-to-br from-card to-background p-6">
          <DialogTitle className="text-xl font-bold">
            {mode === "add" ? "Add Product" : "Edit Product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new product to your catalog"
              : "Update product information"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Basic Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="code">
                    Product Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="code"
                    {...form.register("code")}
                    placeholder="JC-07"
                  />
                  {form.formState.errors.code && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.code.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Black Puffer Jacket"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Categorization */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Categorization</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.watch("category")}
                    onValueChange={(value) =>
                      form.setValue("category", value as Category)
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="mens">Mens</SelectItem>
                      <SelectItem value="womens">Womens</SelectItem>
                      <SelectItem value="slides">Slides</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...form.register("price", { valueAsNumber: true })}
                    placeholder="199.99"
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.price.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Description</h3>
              <Textarea
                {...form.register("description")}
                placeholder="Enter product description..."
                rows={3}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Images */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Images</h3>
              <ImageInput
                value={form.watch("images")}
                onChange={(images) => form.setValue("images", images)}
                error={form.formState.errors.images?.message}
              />
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Sizes</h3>
              <SizeSelector
                value={form.watch("sizes")}
                onChange={(sizes) => form.setValue("sizes", sizes)}
              />
              {form.formState.errors.sizes && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.sizes.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Status</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <Label htmlFor="inStock" className="cursor-pointer">
                    In Stock
                  </Label>
                  <Switch
                    id="inStock"
                    checked={form.watch("inStock")}
                    onCheckedChange={(checked) =>
                      form.setValue("inStock", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <Label htmlFor="featured" className="cursor-pointer">
                    Featured Product
                  </Label>
                  <Switch
                    id="featured"
                    checked={form.watch("featured")}
                    onCheckedChange={(checked) =>
                      form.setValue("featured", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === "add" ? "Add Product" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
