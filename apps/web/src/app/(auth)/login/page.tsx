// src/app/(auth)/login/page.tsx
'use client';

import { LoginForm } from './login-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@repo/ui';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <Card className="w-full glass-card backdrop-blur-lg border border-white/20 dark:border-white/10 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardHeader className="space-y-1">
        <motion.div
          initial={mounted ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Login
          </CardTitle>
        </motion.div>
        <motion.div
          initial={mounted ? { opacity: 0 } : { opacity: 1 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex flex-col gap-2 border-t border-white/10 pt-4">
        <motion.div
          initial={mounted ? { opacity: 0 } : { opacity: 1 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm text-muted-foreground"
        >
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors">
            Sign up
          </Link>
        </motion.div>
      </CardFooter>
    </Card>
  );
}
