// src/app/(marketing)/layout.tsx
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
