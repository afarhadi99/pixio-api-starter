// src/components/account/update-profile-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateProfileSchema, TUpdateProfileSchema } from '@/lib/validators/auth';
import { updateProfile } from '@/lib/actions/auth.actions';
import { User } from '@/types/db_types';
import { motion } from 'framer-motion'; // Import motion

import { Button } from '@repo/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui';
import { Input } from '@repo/ui';

interface UpdateProfileFormProps {
  profile: User | null;
}

export function UpdateProfileForm({ profile }: UpdateProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TUpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      avatar_url: profile?.avatar_url || '',
    },
  });

  async function onSubmit(values: TUpdateProfileSchema) {
    setIsLoading(true);

    try {
      const result = await updateProfile(values);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  // Define form fields with animation delays
  const formFields = [
    { name: "full_name", label: "Name", placeholder: "Your Name", type: "text", delay: 0 },
    { name: "avatar_url", label: "Avatar URL", placeholder: "https://example.com/avatar.jpg", type: "text", delay: 0.1 },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5"> {/* Increased spacing */}
        {formFields.map((field) => (
           <motion.div
             key={field.name}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4, delay: field.delay }}
           >
            <FormField
              control={form.control}
              name={field.name as any}
              render={({ field: formField }) => (
                <FormItem>
                  {/* Styled Label */}
                  <FormLabel className="text-base font-medium text-foreground/90">{field.label}</FormLabel> {/* Larger label */}
                  <FormControl>
                    {/* Styled Input */}
                    <Input
                      placeholder={field.placeholder}
                      {...formField}
                      type={field.type}
                      className="glass-input bg-white/5 border-white/15 focus:border-primary/60 focus:ring-primary/30 focus:ring-2 transition-all text-base p-3 rounded-lg" // Enhanced style
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           </motion.div>
        ))}

        {/* Styled Button */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="glass-button bg-gradient-to-r from-primary to-secondary text-white hover:opacity-95 hover:shadow-lg transition-all duration-300 shadow-md text-lg py-3 font-semibold" // Styled button
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
