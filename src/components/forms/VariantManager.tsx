"use client";

import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState } from "react";

export default function VariantManager({ form }: { form: any }) {
  const { fields: attributeFields, append: appendAttribute, remove: removeAttribute } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const { fields: variantFields, replace: replaceVariants, update: updateVariant } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const generateVariants = () => {
    const attrs = form.getValues("attributes") || [];
    if (attrs.length === 0) return;

    const generate = (idx: number, current: any): any[] => {
      if (idx === attrs.length) return [current];
      const attr = attrs[idx];
      const values = attr.values || [];
      if (values.length === 0) return generate(idx + 1, current);

      let res: any[] = [];
      for (const val of values) {
        res = res.concat(generate(idx + 1, { ...current, [attr.name]: val }));
      }
      return res;
    };

    const combinations = generate(0, {});
    const newVariants = combinations.map((comb) => ({
      attributes: comb,
      price: 0,
      salePrice: 0,
      quantity: 10,
      sku: "",
    }));

    replaceVariants(newVariants);
  };

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Attributes (e.g. Size, Color)</h3>
        {attributeFields.map((field, idx) => (
          <div key={field.id} className="flex gap-4 items-start border p-4 rounded-md">
            <FormField
              control={form.control}
              name={`attributes.${idx}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Attribute Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Size" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`attributes.${idx}.values`}
              render={({ field }) => (
                <FormItem className="flex-[2]">
                  <FormLabel>Values (comma separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. S, M, L"
                      value={field.value?.join(", ") || ""}
                      onChange={(e) => {
                        const vals = e.target.value.split(",").map(v => v.trim()).filter(Boolean);
                        field.onChange(vals);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="destructive"
              className="mt-8"
              onClick={() => removeAttribute(idx)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => appendAttribute({ name: "", values: [] })}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Attribute
        </Button>
      </section>

      <section className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Variants</h3>
          <Button type="button" onClick={generateVariants}>
            Generate Variations
          </Button>
        </div>

        {variantFields.length > 0 && (
          <div className="space-y-4">
            {variantFields.map((field: any, idx: number) => {
              const variantAttrs = field.attributes || {};
              const attrString = Object.entries(variantAttrs)
                .map(([k, v]) => `${k}: ${v}`)
                .join(" | ");

              return (
                <div key={field.id} className="border p-4 rounded-md bg-gray-50 flex gap-4 flex-wrap">
                  <div className="w-full mb-2 font-medium text-gray-700">{attrString}</div>

                  <FormField
                    control={form.control}
                    name={`variants.${idx}.price`}
                    render={({ field }) => (
                      <FormItem className="w-32">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`variants.${idx}.salePrice`}
                    render={({ field }) => (
                      <FormItem className="w-32">
                        <FormLabel>Sale Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`variants.${idx}.quantity`}
                    render={({ field }) => (
                      <FormItem className="w-32">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`variants.${idx}.sku`}
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[200px]">
                        <FormLabel>SKU (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Variant SKU" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
