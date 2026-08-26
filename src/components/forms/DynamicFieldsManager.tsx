"use client";
import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export function FeaturesManager({ form, name, label }: { form: any, name: string, label: string }) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: name,
    });

    return (
        <div className="space-y-4">
            <h3 className="font-semibold">{label}</h3>
            {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border">
                    <div className="flex-1 space-y-2">
                        <FormField
                            control={form.control}
                            name={`${name}.${index}.title`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Title (e.g. High Quality)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`${name}.${index}.description`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Description (e.g. Made with premium materials)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="button" variant="destructive" onClick={() => remove(index)}>
                        Remove
                    </Button>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append({ title: '', description: '' })}>
                + Add {label} Item
            </Button>
        </div>
    );
}

export function CareInstructionsManager({ form, name, label }: { form: any, name: string, label: string }) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: name,
    } as any);

    return (
        <div className="space-y-4">
            <h3 className="font-semibold">{label}</h3>
            {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border">
                    <div className="flex-1">
                        <FormField
                            control={form.control}
                            name={`${name}.${index}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Instruction (e.g. Handle with care)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="button" variant="destructive" onClick={() => remove(index)}>
                        Remove
                    </Button>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append("")}>
                + Add Instruction
            </Button>
        </div>
    );
}
