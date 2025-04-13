"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useResourceLibrary } from "@/hooks/useResourceLibrary";
import type { Tool } from "@/hooks/use-workflow";

// Zod schema for validation
// Note: Tool names must be unique, but this validation happens in the hook, not the schema itself.
const toolSchema = z.object({
  name: z.string().min(3, { message: "Tool name must be at least 3 characters." }),
  category: z.string().min(3, { message: "Category must be at least 3 characters." }),
  url: z.string().url({ message: "Please enter a valid URL." }),
});

type ToolFormData = z.infer<typeof toolSchema>;

interface ToolFormProps {
  tool?: Tool | null; // Tool data for editing, null/undefined for adding
  onClose: () => void; // Function to close the form/modal section
}

export default function ToolForm({ tool, onClose }: ToolFormProps) {
  const { addToolDefinition, updateToolDefinition } = useResourceLibrary();
  const isEditing = !!tool;

  const form = useForm<ToolFormData>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: tool?.name || "",
      category: tool?.category || "",
      url: tool?.url || "",
    },
  });

  const onSubmit: SubmitHandler<ToolFormData> = (data) => {
    if (isEditing && tool) {
      // For editing, we pass the complete updated tool object.
      // Since the name is the identifier and might be changed,
      // the updateToolDefinition hook needs to handle finding the original tool if the name changes.
      // However, the current hook implementation assumes the name *doesn't* change during edit.
      // For simplicity here, we'll assume the name isn't editable or the hook handles it.
      // A more robust implementation might prevent editing the name or pass the original name.
      updateToolDefinition({ ...tool, ...data });
    } else {
      addToolDefinition(data); // Add new tool
    }
    onClose(); // Close the form after submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded-md mb-4 bg-background shadow-sm">
         <h4 className="text-md font-semibold mb-3">{isEditing ? 'Edit Tool' : 'Add New Tool'}</h4>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tool Name</FormLabel>
              <FormControl>
                {/* Consider making name read-only if editing, depending on update logic */}
                <Input placeholder="Enter unique tool name..." {...field} disabled={isEditing} />
              </FormControl>
              {isEditing && <FormDescription>Tool name cannot be changed after creation.</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Keyword Research, AI Assistant" {...field} />
              </FormControl>
               <FormDescription>Group similar tools together.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tool URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-2">
           <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">{isEditing ? 'Save Changes' : 'Add Tool'}</Button>
        </div>
      </form>
    </Form>
  );
}
