"use client";

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useResourceLibrary } from "@/hooks/useResourceLibrary";
import type { Prompt } from "@/hooks/use-workflow";

// Zod schema for validation
const promptSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  category: z.string().min(3, { message: "Category must be at least 3 characters." }),
  content: z.string().min(10, { message: "Prompt content must be at least 10 characters." }),
  favorite: z.boolean().default(false),
});

type PromptFormData = z.infer<typeof promptSchema>;

interface PromptFormProps {
  prompt?: Prompt | null; // Prompt data for editing, null/undefined for adding
  onClose: () => void; // Function to close the form/modal section
}

export default function PromptForm({ prompt, onClose }: PromptFormProps) {
  const { addPromptDefinition, updatePromptDefinition } = useResourceLibrary();
  const isEditing = !!prompt;

  const form = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: prompt?.title || "",
      category: prompt?.category || "",
      content: prompt?.content || "",
      favorite: prompt?.favorite || false,
    },
  });

  const onSubmit: SubmitHandler<PromptFormData> = (data) => {
    if (isEditing && prompt) {
      updatePromptDefinition({ ...prompt, ...data }); // Spread existing prompt data (like id) and update with form data
    } else {
      addPromptDefinition(data); // Add new prompt (id will be generated in the hook)
    }
    onClose(); // Close the form after submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded-md mb-4 bg-background shadow-sm">
         <h4 className="text-md font-semibold mb-3">{isEditing ? 'Edit Prompt' : 'Add New Prompt'}</h4>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter prompt title..." {...field} />
              </FormControl>
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
                <Input placeholder="e.g., Research, Drafting, SEO" {...field} />
              </FormControl>
               <FormDescription>Group similar prompts together.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter the full prompt text. Use placeholders like [primary keyword], [brand voice], [output from step X: field]..." {...field} rows={6} />
              </FormControl>
               <FormDescription>Placeholders will be replaced during workflow execution.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="favorite"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm bg-muted/30">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Mark as Favorite
                </FormLabel>
                <FormDescription>
                  Favorite prompts appear first in the list.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-2">
           <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">{isEditing ? 'Save Changes' : 'Add Prompt'}</Button>
        </div>
      </form>
    </Form>
  );
}
