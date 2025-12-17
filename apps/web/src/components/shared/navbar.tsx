// src/components/shared/navbar.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@repo/supabase/client';
import { cn } from '@repo/ui/utils';

import { Button } from '@repo/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui';
import { User } from '@/types/db_types';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { logout } from '@/lib/actions/auth.actions';
import { CreditsDisplay } from '@/components/shared/credits-display';

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  
  const isMarketing = pathname === '/' || pathname === '/pricing';
  
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setUser(data);
      }
      
      setLoading(false);
    }
    
    getUser();
  }, []);
  
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
      scrolled || !isMarketing 
        ? "bg-background/80 backdrop-blur-md border-b border-primary/10"
        : "bg-transparent"
    )}>
      <div className="container flex items-center justify-between mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Pixio<span className="font-bold">API</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          {isMarketing ? (
            // Marketing navigation
            <>
              
              {!loading && user ? (
                <Link href="/dashboard">
                  <Button className="glass-button gradient-purple-pink">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="hover:bg-primary/10">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="glass-button gradient-purple-pink">Sign up</Button>
                  </Link>
                </>
              )}
            </>
          ) : (
            // Authenticated navigation
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="hover:bg-primary/10">Dashboard</Button>
              </Link>
              
              {!loading && user && (
                <>
                  {/* Add credits display with glassmorphic style */}
                  <CreditsDisplay />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-primary/10">
                        <Avatar className="h-8 w-8 border border-primary/20">
                          <AvatarImage src={user.avatar_url || ''} alt={user.full_name || 'User'} />
                          <AvatarFallback className="bg-primary/10">{user.full_name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          {user.full_name && <p className="font-medium">{user.full_name}</p>}
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/account" className="w-full flex justify-between items-center hover:bg-primary/10">
                          Account <Settings className="h-4 w-4" />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <form action={logout} className="w-full">
                          <button type="submit" className="w-full flex justify-between items-center">
                            Logout <LogOut className="h-4 w-4" />
                          </button>
                        </form>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
