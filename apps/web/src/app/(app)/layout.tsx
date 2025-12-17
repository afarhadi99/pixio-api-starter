// src/app/(app)/layout.tsx
import { Navbar } from '@/components/shared/navbar';
import { createClient } from '@repo/supabase/server';
import { redirect } from 'next/navigation';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden"> {/* Added relative and overflow-hidden */}
      {/* Background Gradient (Optional - you might already have one on body or main) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

      {/* Grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[url('/grid.svg')] bg-[length:10px_10px] bg-repeat opacity-5"></div>

      {/* Navbar (ensure it has a background or backdrop-blur if needed) */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pt-16 pb-8 z-10"> {/* Added z-10 to ensure content is above background */}
        {children}
      </main>
    </div>
  );
}
