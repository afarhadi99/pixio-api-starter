// src/app/(auth)/signup/signup-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { signupSchema, TSignupSchema } from '@/lib/validators/auth';
import { signup } from '@/lib/actions/auth.actions';

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

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      full_name: '',
    },
  });
  
  async function onSubmit(values: TSignupSchema) {
    setIsLoading(true);
    
    try {
      const result = await signup(values);
      
      if (result?.error) {
        toast.error(result.error);
      }
    } finally {
      setIsLoading(false);
    }
  }
  
  const formFields = [
    { name: "full_name", label: "Name", placeholder: "Your Name", type: "text" },
    { name: "email", label: "Email", placeholder: "you@example.com", type: "email" },
    { name: "password", label: "Password", placeholder: "••••••••", type: "password" },
  ];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {formFields.map((field, i) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * i }}
          >
            <FormField
              control={form.control}
              name={field.name as any}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90">{field.label}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={field.placeholder} 
                      {...formField} 
                      type={field.type}
                      className="glass-input bg-white/10 dark:bg-white/5 border-white/20 focus:border-primary/50 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        ))}
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary/90 to-secondary/90 text-white hover:opacity-90 hover:shadow-lg transition-all shadow-md mt-2"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
