"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Size } from "@/types/shop";

const SIZE_TEMPLATES = {
  clothing: ["XS", "S", "M", "L", "XL", "XXL"],
  shoes: ["6", "7", "8", "9", "10", "11", "12", "13"],
  oneSize: ["ONE SIZE"],
} as const;

type SizeTemplate = keyof typeof SIZE_TEMPLATES;

interface SizeSelectorProps {
  value: Size[];
  onChange: (sizes: Size[]) => void;
}

export function SizeSelector({ value, onChange }: SizeSelectorProps) {
  const [template, setTemplate] = useState<SizeTemplate>("clothing");

  const handleTemplateChange = (newTemplate: SizeTemplate) => {
    setTemplate(newTemplate);
    // Reset sizes when template changes
    onChange([]);
  };

  const isSizeSelected = (sizeValue: string) => {
    return value.some((s) => s.value === sizeValue);
  };

  const getSizeAvailability = (sizeValue: string) => {
    const size = value.find((s) => s.value === sizeValue);
    return size?.available ?? true;
  };

  const getSizeStockQuantity = (sizeValue: string) => {
    const size = value.find((s) => s.value === sizeValue);
    return size?.stockQuantity ?? 0;
  };

  const toggleSize = (sizeValue: string, checked: boolean) => {
    if (checked) {
      // Add size
      const newSize: Size = {
        value: sizeValue,
        label: sizeValue,
        available: true,
        stockQuantity: 10, // Default stock quantity
      };
      onChange([...value, newSize]);
    } else {
      // Remove size
      onChange(value.filter((s) => s.value !== sizeValue));
    }
  };

  const toggleAvailability = (sizeValue: string, available: boolean) => {
    onChange(
      value.map((s) => (s.value === sizeValue ? { ...s, available } : s))
    );
  };

  const updateStockQuantity = (sizeValue: string, quantity: number) => {
    onChange(
      value.map((s) =>
        s.value === sizeValue
          ? { ...s, stockQuantity: Math.max(0, quantity), available: quantity > 0 }
          : s
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Template Selector */}
      <div className="space-y-2">
        <Label>Size Template</Label>
        <Select value={template} onValueChange={handleTemplateChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clothing">Clothing Sizes</SelectItem>
            <SelectItem value="shoes">Shoe Sizes</SelectItem>
            <SelectItem value="oneSize">One Size</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Size Grid */}
      <div className="space-y-2">
        <Label>Available Sizes & Inventory</Label>
        <div className="grid gap-3">
          {SIZE_TEMPLATES[template].map((size) => {
            const isSelected = isSizeSelected(size);
            const isAvailable = getSizeAvailability(size);
            const stockQuantity = getSizeStockQuantity(size);

            return (
              <div
                key={size}
                className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`size-${size}`}
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        toggleSize(size, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`size-${size}`}
                      className="cursor-pointer font-medium"
                    >
                      {size}
                    </Label>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`availability-${size}`}
                        className="text-sm text-muted-foreground"
                      >
                        Available
                      </Label>
                      <Switch
                        id={`availability-${size}`}
                        checked={isAvailable}
                        onCheckedChange={(checked) =>
                          toggleAvailability(size, checked)
                        }
                      />
                    </div>
                  )}
                </div>

                {isSelected && (
                  <div className="flex items-center gap-2 pl-9">
                    <Label
                      htmlFor={`stock-${size}`}
                      className="text-sm text-muted-foreground"
                    >
                      Stock:
                    </Label>
                    <Input
                      id={`stock-${size}`}
                      type="number"
                      min="0"
                      value={stockQuantity}
                      onChange={(e) =>
                        updateStockQuantity(size, parseInt(e.target.value) || 0)
                      }
                      className="w-24"
                    />
                    <span className="text-xs text-muted-foreground">
                      units
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {value.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Select at least one size to continue
        </p>
      )}
    </div>
  );
}
