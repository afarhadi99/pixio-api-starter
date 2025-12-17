// src/components/account/credit-pack-card.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@repo/ui';
import { Button } from '@repo/ui';
import { formatPrice } from '@repo/ui/utils';
import { toast } from 'sonner';
import { motion } from 'framer-motion'; // Import motion
import { Sparkles } from 'lucide-react'; // Added icon

interface CreditPackCardProps {
  creditPack: {
    id: string;
    name: string;
    description: string;
    amount: number;
    price: number;
    priceId: string;
  };
}

export function CreditPackCard({ creditPack }: CreditPackCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/purchase-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: creditPack.priceId }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    // Styled Card with hover effect
    <motion.div
       whileHover={{ y: -5, scale: 1.03 }} // Lift effect on hover
       transition={{ type: "spring", stiffness: 300, damping: 20 }}
       className="h-full" // Ensure motion div takes full height for flex parent
    >
      <Card className="glass-card border border-white/15 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        <CardContent className="p-6 flex flex-col flex-grow space-y-4"> {/* Increased spacing */}
          <div className="flex-grow space-y-2">
            {/* Credit Amount Display */}
            <div className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block">
              <Sparkles className="w-6 h-6" />
              {creditPack.amount.toLocaleString()} Credits
            </div>

            {/* Name and Description */}
            <div>
              <h3 className="text-lg font-semibold text-foreground/95">{creditPack.name}</h3> {/* Larger text */}
              <p className="text-sm text-muted-foreground">{creditPack.description}</p>
            </div>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-primary/90 mt-auto">{formatPrice(creditPack.price)}</div> {/* Larger, colored price */}

          {/* Purchase Button */}
          <Button
            onClick={handlePurchase}
            className="w-full glass-button bg-gradient-to-r from-secondary to-accent text-white hover:opacity-95 hover:shadow-lg transition-all duration-300 shadow-md text-base py-2.5 font-semibold" // Styled button
            disabled={isLoading || !creditPack.priceId}
          >
            {isLoading ? 'Processing...' : 'Purchase'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
