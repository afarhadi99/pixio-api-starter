// src/app/(marketing)/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
  useInView,
  AnimatePresence
} from 'framer-motion';
import { Button } from '@repo/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@repo/ui';
import { PRICING_TIERS, PricingTier, getTierByPriceId } from '@/lib/config/pricing';
import { Check, ExternalLink, ArrowRight, Star, Sparkles, Zap, Github } from 'lucide-react';
import { formatPrice } from '@repo/ui/utils';
import { toast } from 'sonner';
import { createClient } from '@repo/supabase/client';
import { Subscription } from '@/types/db_types';
import { Footer } from '@/components/shared/footer';

// Define prop types for components
interface WorkflowCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  index: number;
}

// --- MouseTrackCard with Border Glow ---
const MouseTrackCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Springs for animation - always initialize them
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  // Always create the motion template regardless of hover state
  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`;

  // Client-side effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovered) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -8;
    const rotateYValue = ((x - centerX) / centerX) * 8;

    setMousePosition({ x: rotateYValue, y: rotateXValue });
  };

  // Update spring animations
  useEffect(() => {
    if (isHovered) {
      rotateX.set(mousePosition.y);
      rotateY.set(mousePosition.x);
    } else {
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [mousePosition, isHovered, rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformStyle: "preserve-3d", transform }}
    >
      {/* Border Glow effect - visible when mounted and hovered */}
      <motion.div
        className="absolute -inset-0.5 rounded-[inherit] z-[-1]"
        style={{
          // Apply a box shadow for the glow effect
          boxShadow: isMounted && isHovered
            ? '0 0 15px 3px oklch(var(--primary) / 0.5)' // Use primary color with alpha
            : 'none',
          opacity: isMounted && isHovered ? 1 : 0, // Control visibility
          transition: 'box-shadow 0.3s ease-in-out, opacity 0.3s ease-in-out', // Smooth transition
        }}
      />
      {children}
    </motion.div>
  );
};


// Fixed Animated Background to prevent hydration mismatch
const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Only run on client side
  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to viewport center
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Use consistent deterministic values for server rendering
  // Generate fixed positions for particles to prevent hydration mismatch
  const particlePositions = Array.from({ length: 20 }).map((_, i) => ({
    top: `${(i * 5) % 100}%`,
    left: `${(i * 7) % 100}%`,
    opacity: 0.3 + ((i % 5) * 0.1),
    animationDuration: `${10 + (i % 10)}s`,
    animationDelay: `${(i % 10) * 0.5}s`
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

      {/* Grid pattern - only add mousemove effect after mount */}
      <div
        className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:10px_10px] bg-repeat opacity-5"
        style={mounted ? {
          transform: `translateX(${mousePosition.x * -5}px) translateY(${mousePosition.y * -5}px)`,
          transition: "transform 1s cubic-bezier(0.075, 0.82, 0.165, 1)"
        } : {}}
      />

      {/* Moving circles - large ones with conditional transforms */}
      <div
        className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-primary/5 filter blur-[100px] animate-float"
        style={{
          animationDuration: '30s',
          transform: mounted ? `translateX(${mousePosition.x * -30}px) translateY(${mousePosition.y * -30}px)` : 'none'
        }}
      />
      <div
        className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-secondary/5 filter blur-[100px] animate-float"
        style={{
          animationDuration: '25s',
          animationDelay: '2s',
          transform: mounted ? `translateX(${mousePosition.x * -20}px) translateY(${mousePosition.y * -20}px)` : 'none'
        }}
      />
      <div
        className="absolute bottom-[15%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-accent/5 filter blur-[100px] animate-float"
        style={{
          animationDuration: '28s',
          animationDelay: '1s',
          transform: mounted ? `translateX(${mousePosition.x * -25}px) translateY(${mousePosition.y * -25}px)` : 'none'
        }}
      />

      {/* Moving circles - medium ones */}
      <div className="absolute top-[30%] left-[25%] w-[20vw] h-[20vw] rounded-full bg-primary/10 filter blur-[80px] animate-float" style={{ animationDuration: '20s', animationDelay: '3s' }}></div>
      <div className="absolute top-[60%] right-[25%] w-[25vw] h-[25vw] rounded-full bg-secondary/10 filter blur-[80px] animate-float" style={{ animationDuration: '22s', animationDelay: '2.5s' }}></div>

      {/* Moving circles - small ones */}
      <div className="absolute top-[15%] right-[30%] w-[10vw] h-[10vw] rounded-full bg-accent/10 filter blur-[50px] animate-float" style={{ animationDuration: '18s', animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-[25%] right-[15%] w-[15vw] h-[15vw] rounded-full bg-primary/10 filter blur-[60px] animate-float" style={{ animationDuration: '15s', animationDelay: '1s' }}></div>
      <div className="absolute bottom-[45%] left-[10%] w-[12vw] h-[12vw] rounded-full bg-secondary/10 filter blur-[60px] animate-float" style={{ animationDuration: '17s', animationDelay: '0.5s' }}></div>

      {/* Animated particles with fixed positions to prevent hydration mismatch */}
      <div className="particles absolute inset-0 z-0">
        {particlePositions.map((pos, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 rounded-full bg-white/40"
            style={{
              top: pos.top,
              left: pos.left,
              opacity: pos.opacity,
              animation: `float ${pos.animationDuration} linear infinite`,
              animationDelay: pos.animationDelay
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Fixed MagneticButton - similar approach to MouseTrackCard
const MagneticButton: React.FC<{
  children: React.ReactNode,
  className?: string,
  onClick?: () => void,
  disabled?: boolean; // Added disabled prop
}> = ({ children, className, onClick, disabled }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Always initialize the springs
  const xMotion = useSpring(0, { damping: 20, stiffness: 200 });
  const yMotion = useSpring(0, { damping: 20, stiffness: 200 });

  // Client-side effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !isHovered || disabled) return; // Ignore if disabled

    const rect = buttonRef.current.getBoundingClientRect();
    // Calculate distance from center
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    // Scale down movement for subtlety (maximum 10px movement)
    setPosition({
      x: x * 0.2,
      y: y * 0.2
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  // Update springs in useEffect
  useEffect(() => {
    if (isMounted && !disabled) { // Only update if not disabled
      xMotion.set(position.x);
      yMotion.set(position.y);
    } else { // Reset if disabled
      xMotion.set(0);
      yMotion.set(0);
    }
  }, [position, xMotion, yMotion, isMounted, disabled]);

  return (
    <motion.button
      ref={buttonRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !disabled && setIsHovered(true)} // Only hover if not disabled
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled} // Pass disabled prop
      style={{
        x: xMotion,
        y: yMotion,
        transition: "transform 0.1s ease"
      }}
    >
      {children}
    </motion.button>
  );
};

// Enhanced underlined heading with gradient
const GradientHeading: React.FC<{
  children: React.ReactNode,
  className?: string,
  from?: string,
  via?: string,
  to?: string
}> = ({ children, className, from = "from-primary", via = "via-secondary", to = "to-accent" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`relative inline-block ${className || ''}`}
      initial={isMounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={isMounted && isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${from} ${via} ${to}`}>
        {children}
      </h2>
      {isMounted && (
        <motion.div
          className={`absolute -bottom-2 left-0 h-1 bg-gradient-to-r ${from} ${via} ${to} rounded-full`}
          initial={{ width: "0%" }}
          animate={isInView ? { width: "100%" } : { width: "0%" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </motion.div>
  );
};

// Workflow card component
const WorkflowCard = ({ title, description, link, icon, index }: WorkflowCardProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <MouseTrackCard className="h-full">
      <Card className="glass-card h-full backdrop-blur-lg border border-white/20 dark:border-white/10 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all duration-300 overflow-hidden">
        <motion.div
          initial={isMounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          whileInView={isMounted ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
          className="h-full flex flex-col"
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              {icon}
              <span>{title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow">
            <CardDescription className="text-sm text-foreground/80">{description}</CardDescription>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              variant="outline"
              className="gap-1 glass-button bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 hover:text-primary w-full justify-center group"
              asChild
            >
              <Link href={link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Open in Pixio API</span>
              </Link>
            </Button>
          </CardFooter>
        </motion.div>
      </Card>
    </MouseTrackCard>
  );
};

// --- Pricing section integrated for the homepage ---
interface PricingSectionProps {
  userTierId: string;
  isAuthenticated: boolean;
}

const PricingSection = ({ userTierId, isAuthenticated }: PricingSectionProps) => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [isMounted, setIsMounted] = useState(false);
  const switchRef = useRef<HTMLButtonElement>(null);
  const toggleAnimation = useRef(false);
  const [isLoading, setIsLoading] = useState<string | null>(null); // State for button loading

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animate the toggle switch on initial render - only on client
  useEffect(() => {
    if (isMounted && !toggleAnimation.current && switchRef.current) {
      setTimeout(() => {
        setBillingInterval('yearly');
        setTimeout(() => {
          setBillingInterval('monthly');
          toggleAnimation.current = true;
        }, 1500);
      }, 1000);
    }
  }, [isMounted]);

  // Function to handle subscription with redirect checkout
  const handleSubscribe = async (priceId: string) => {
    // This should only be called if isAuthenticated is true
    if (!isAuthenticated) return;

    setIsLoading(priceId);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error(error.message || 'Something went wrong');
      setIsLoading(null);
    }
  };


  return (
    <>
      <div className="text-center mb-12">
        <GradientHeading className="mb-4 justify-center mx-auto text-center">
          Simple, Transparent Pricing
        </GradientHeading>
        <motion.p
          className="text-lg text-muted-foreground mb-8"
          initial={isMounted ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          whileInView={isMounted ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Choose the perfect plan for your needs. All plans include access to Pixio API machines.
        </motion.p>

        {/* Billing toggle */}
        <motion.div
          className="flex items-center justify-center space-x-4 mb-8"
          initial={isMounted ? { opacity: 0 } : { opacity: 1 }}
          whileInView={isMounted ? { opacity: 1 } : {}}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className={`text-sm ${billingInterval === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            ref={switchRef}
            type="button"
            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary/20 backdrop-blur-sm transition-colors duration-300 ease-spring focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 group"
            role="switch"
            aria-checked={billingInterval === 'yearly'}
            onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
          >
            <motion.span
              aria-hidden="true"
              className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-all duration-300"
              animate={isMounted ? {
                x: billingInterval === 'yearly' ? 20 : 0
              } : {}}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            />
            <span className="sr-only">{billingInterval === 'monthly' ? 'Switch to yearly billing' : 'Switch to monthly billing'}</span>

            {/* Particle effects on toggle - client-side only */}
            {isMounted && (
              <AnimatePresence>
                {billingInterval === 'yearly' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-0 top-0"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-accent/50"
                        initial={{
                          x: 0,
                          y: 0,
                          opacity: 1,
                          scale: 0.5 + (i * 0.1)
                        }}
                        animate={{
                          x: ((i % 3) - 1) * 10,
                          y: ((i % 3) - 1) * 10,
                          opacity: 0,
                          scale: 0
                        }}
                        transition={{
                          duration: 0.4 + (i * 0.1),
                          ease: "easeOut"
                        }}
                        style={{
                          top: `${(i * 20) + 10}%`,
                          right: `${(i * 10) + 10}%`
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </button>
          <span className={`text-sm flex items-center gap-1.5 ${billingInterval === 'yearly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
            Yearly
            <motion.span
              className="inline-block px-1.5 py-0.5 text-xs rounded-full bg-accent/10 text-accent/90 font-medium backdrop-blur-sm"
              animate={isMounted ? {
                scale: billingInterval === 'yearly' ? [1, 1.1, 1] : 1
              } : {}}
              transition={{
                duration: 0.4,
                times: [0, 0.5, 1],
                ease: "easeInOut"
              }}
            >
              Save up to 16%
            </motion.span>
          </span>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PRICING_TIERS.map((tier, index) => {
          const price = tier.pricing[billingInterval];
          const isCurrentPlan = userTierId === tier.id;

          // Determine button content and action based on authentication state
          let buttonContent: React.ReactNode;
          let buttonAction: (() => void) | undefined;
          let buttonLink: string | undefined;
          let buttonDisabled = false;
          let buttonStyleClass = tier.popular
            ? 'bg-gradient-to-r from-primary/90 to-secondary/90 text-white hover:opacity-90'
            : 'glass-button bg-white/10 hover:bg-white/20 text-foreground';

          if (!isAuthenticated) {
            // --- Unauthenticated User Logic ---
            buttonContent = "Sign up";
            buttonLink = "/signup";
            buttonStyleClass = 'glass-button bg-white/10 hover:bg-white/20 text-foreground'; // Consistent style for signup
          } else {
            // --- Authenticated User Logic ---
            if (price.priceId) {
              // Paid Tier
              if (isCurrentPlan) {
                buttonContent = "Current Plan";
                buttonDisabled = true;
                buttonStyleClass += ' cursor-not-allowed opacity-60';
              } else {
                buttonContent = isLoading === price.priceId ? 'Processing...' : 'Subscribe';
                buttonAction = () => handleSubscribe(price.priceId!);
                buttonDisabled = isLoading === price.priceId;
              }
            } else {
              // Free Tier
              if (isCurrentPlan) {
                buttonContent = "Current Plan";
                buttonDisabled = true;
                buttonStyleClass += ' cursor-not-allowed opacity-60';
              } else {
                buttonContent = "Get Started";
                buttonLink = "/dashboard"; // Authenticated users go to dashboard from free tier
              }
            }
          }

          return (
            <MouseTrackCard key={tier.id} className="h-full">
              <motion.div
                initial={isMounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={isMounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                className="h-full"
              >
                <Card className={`glass-card backdrop-blur-lg border relative overflow-hidden h-full flex flex-col
                  ${tier.popular ? 'border-primary/30 shadow-lg shadow-primary/10 dark:shadow-primary/20' : 'border-white/20 dark:border-white/10'}
                  hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all duration-300`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-primary/90 to-secondary/90 text-white text-xs px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span>Popular</span>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className={`text-xl ${tier.popular ? "text-primary" : ""}`}>{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                    <div className="mt-4">
                      {price.amount ? (
                        <div className="flex items-end">
                          <motion.span
                            className="text-3xl font-bold"
                            key={`${price.amount}-${billingInterval}`}
                            initial={isMounted ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
                            animate={isMounted ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            {formatPrice(price.amount)}
                          </motion.span>
                          <span className="text-muted-foreground ml-1 mb-1">/{billingInterval === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold">Free</span>
                      )}

                      {isMounted && billingInterval === 'yearly' && tier.pricing.yearly.discount && (
                        <motion.p
                          className="text-sm text-accent/90 mt-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          key="yearly-discount"
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          Save {tier.pricing.yearly.discount}% with annual billing
                        </motion.p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pb-0 flex-grow">
                    <ul className="space-y-2">
                      {tier.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start gap-2"
                          initial={isMounted ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                          whileInView={isMounted ? { opacity: 1, x: 0 } : {}}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.05 * i }}
                        >
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-6 mt-6">
                    <MagneticButton
                      onClick={buttonAction}
                      disabled={buttonDisabled}
                      className={`w-full rounded-md py-2 px-4 font-medium ${buttonStyleClass}`}
                    >
                      {buttonLink ? (
                        <Link href={buttonLink} className="flex items-center justify-center w-full h-full">
                          {buttonContent}
                        </Link>
                      ) : (
                        buttonContent
                      )}
                    </MagneticButton>
                  </CardFooter>
                </Card>
              </motion.div>
            </MouseTrackCard>
          );
        })}
      </div>
    </>
  );
};


// --- Main Landing Page Component ---
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);
  const progressBarScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // State for user and subscription data
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userTierId, setUserTierId] = useState<string>('free'); // Default to free

  // Fetch user and subscription data on client-side
  useEffect(() => {
    setMounted(true);

    const checkAuthAndSubscription = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (user) {
        // Fetch subscription if user is logged in
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*, prices(id, products(*))')
          .eq('user_id', user.id)
          .in('status', ['trialing', 'active'])
          .maybeSingle();

        if (subscription) {
          const priceId = subscription.prices?.id;
          const { tier } = getTierByPriceId(priceId);
          if (tier) {
            setUserTierId(tier.id);
          }
        } else {
          setUserTierId('free'); // User is logged in but has no active subscription
        }
      } else {
        setUserTierId('free'); // User is not logged in
      }
    };

    checkAuthAndSubscription();
  }, []);

  return (
    <>
      {/* Progress bar - only on client */}
      {mounted && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent z-50 origin-left"
          style={{ scaleX: progressBarScaleX }}
        />
      )}

      {/* Animated background */}
      <AnimatedBackground />

      {/* Hero section */}
      <motion.section
        className="relative py-24 md:py-36 z-10"
        style={mounted ? { opacity: heroOpacity, y: heroY } : {}}
      >
        <div className="container mx-auto px-4 relative">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-4 px-4 py-1.5 bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-full text-foreground/90 text-sm border border-white/20 shadow-lg"
              initial={mounted ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-accent/80" />
                Powered by Pixio A100 GPUs
              </span>
            </motion.div>

            <motion.div
              initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(to right, #7068F4, #FF64B4, #ffac4c)",
                  backgroundSize: "200% 200%",
                  ...(mounted ? {
                    animation: "gradientMove 15s ease infinite"
                  } : {})
                }}
              >
                Pixio API Starter
              </h1>

              <style jsx global>{`
                @keyframes gradientMove {
                  0% { background-position: 0% 50% }
                  50% { background-position: 100% 50% }
                  100% { background-position: 0% 50% }
                }
              `}</style>
            </motion.div>

            <motion.p
              className="text-lg sm:text-xl text-foreground/80 mb-8 leading-relaxed"
              initial={mounted ? { opacity: 0 } : { opacity: 1 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Unleash AI creativity with powerful machines for stunning image and video generation,
              powered by Supabase and a flexible credit system
            </motion.p>

            <motion.div
  className="flex flex-col sm:flex-row gap-4 justify-center"
  initial={mounted ? { opacity: 0 } : { opacity: 1 }}
  animate={mounted ? { opacity: 1 } : {}}
  transition={{ delay: 0.7, duration: 0.8 }}
>
  <MagneticButton className="bg-gradient-to-r from-primary/90 to-secondary/90 hover:from-primary/95 hover:to-secondary/95 text-white rounded-md py-2 px-4 font-medium shadow-md hover:shadow-lg transition-shadow">
    <Link href="https://api.myapps.ai" target="_blank" rel="noopener noreferrer" className="flex items-center">
      <ExternalLink className="mr-2 h-4 w-4" />
      Visit Pixio API
    </Link>
  </MagneticButton>

  <MagneticButton
    className="glass-button bg-white/10 hover:bg-white/20 text-foreground rounded-md py-2 px-4 font-medium"
    onClick={() => {
      if (mounted) {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }}
  >
    View Plans
  </MagneticButton>
  
  <MagneticButton className="glass-button bg-white/10 hover:bg-white/20 text-foreground rounded-md py-2 px-4 font-medium">
    <Link href="https://github.com/afarhadi99/pixio-api-starter" target="_blank" rel="noopener noreferrer" className="flex items-center">
      <Github className="mr-2 h-4 w-4" />
      Fork Repo
    </Link>
  </MagneticButton>
</motion.div>
          </motion.div>
        </div>

        {/* Bouncing arrow indicator - client-side only */}
        {mounted && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{
              y: [0, 10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary/70"
              whileHover={{ scale: 1.2 }}
            >
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </motion.svg>
          </motion.div>
        )}
      </motion.section>

      {/* Features section */}
      <section className="py-20 z-10 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <GradientHeading className="mx-auto justify-center">
              Powerful AI Generation Features
            </GradientHeading>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <MouseTrackCard>
              <motion.div
                className="glass-card rounded-xl p-6 backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Image Generation</h3>
                <p className="text-foreground/80">
                  Create stunning images using advanced AI machines powered by the Pixio API. Turn text prompts into visual art.
                </p>
              </motion.div>
            </MouseTrackCard>

            {/* Feature 2 */}
            <MouseTrackCard>
              <motion.div
                className="glass-card rounded-xl p-6 backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-12 h-12 bg-secondary/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-secondary">Video Generation</h3>
                <p className="text-foreground/80">
                  Transform concepts into mesmerizing videos. Our API harnesses the power of cutting-edge AI for fluid animations.
                </p>
              </motion.div>
            </MouseTrackCard>

            {/* Feature 3 */}
            <MouseTrackCard>
              <motion.div
                className="glass-card rounded-xl p-6 backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="w-12 h-12 bg-accent/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-accent/90">Credit System</h3>
                <p className="text-foreground/80">
                  Flexible credit-based system with pay-as-you-go options. Use credits for different generation types based on your needs.
                </p>
              </motion.div>
            </MouseTrackCard>
          </div>
        </div>
      </section>

      {/* Pixio API machines section */}
      <section className="py-20 z-10 relative" id="workflows">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <GradientHeading className="mx-auto justify-center" from="from-secondary" to="to-primary">
              Pixio API Models
            </GradientHeading>

            <motion.p
              className="text-center text-foreground/80 mt-6 mb-12 max-w-3xl mx-auto"
              initial={mounted ? { opacity: 0 } : { opacity: 1 }}
              whileInView={mounted ? { opacity: 1 } : {}}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Powerful AI models integrated into your application for image generation, editing, and video creation
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <WorkflowCard
              title="Krea Flux"
              description="High-quality image generation with the Flux model. Perfect for fashion, portraits, and detailed imagery. Create stunning visuals from text prompts."
              link="https://api.myapps.ai/share/workflow/user_2avNabxB8PQU2qdh6dkcHx6J7AI/krea"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>}
              index={1}
            />

            <WorkflowCard
              title="Qwen Edit"
              description="AI-powered image editing with multiple image inputs and positive/negative prompting. Transform and enhance your images with intelligent edits."
              link="https://api.myapps.ai/share/workflow/user_34PT7Nq6CR0OkBRluLtZZAPYUWy/qwen-edit-clone"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>}
              index={2}
            />

            <WorkflowCard
              title="Wan 2.2 First/Last Frame"
              description="Generate smooth video transitions between two keyframe images. Create cinematic animations from start and end images with AI-powered interpolation."
              link="https://api.myapps.ai/share/workflow/user_34PT7Nq6CR0OkBRluLtZZAPYUWy/wan22-first-last-frame"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>}
              index={3}
            />
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-20 z-10 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <GradientHeading className="mx-auto justify-center" from="from-accent/90" via="via-primary" to="to-secondary">
              How Pixio API Works
            </GradientHeading>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line with animated gradient - client-side only */}
            {mounted && (
              <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-1 overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent"
                  animate={{
                    x: ["-100%", "100%"]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
            )}

            {/* Step 1 */}
            <MouseTrackCard>
              <motion.div
                className="relative glass-card p-6 text-center backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="bg-gradient-to-r from-primary to-secondary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative">
                  {mounted ? (
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      1
                    </motion.span>
                  ) : (
                    <span>1</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose Your Type</h3>
                <p className="text-foreground/80">
                  Select between image or video generation in the intuitive dashboard interface.
                </p>
              </motion.div>
            </MouseTrackCard>

            {/* Step 2 */}
            <MouseTrackCard>
              <motion.div
                className="relative glass-card p-6 text-center backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-gradient-to-r from-secondary to-accent/80 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative">
                  {mounted ? (
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    >
                      2
                    </motion.span>
                  ) : (
                    <span>2</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Your Prompt</h3>
                <p className="text-foreground/80">
                  Write detailed prompts to guide the AI in generating your desired output.
                </p>
              </motion.div>
            </MouseTrackCard>

            {/* Step 3 */}
            <MouseTrackCard>
              <motion.div
                className="relative glass-card p-6 text-center backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="bg-gradient-to-r from-accent/80 to-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative">
                  {mounted ? (
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                    >
                      3
                    </motion.span>
                  ) : (
                    <span>3</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">Generate & Download</h3>
                <p className="text-foreground/80">
                  Use your credits to generate the media and download your creations instantly.
                </p>
              </motion.div>
            </MouseTrackCard>
          </div>
        </div>
      </section>

      {/* Pricing section - Pass user data */}
      <section className="py-20 z-10 relative" id="pricing">
        <div className="container mx-auto px-4">
          <PricingSection userTierId={userTierId} isAuthenticated={isAuthenticated} />
        </div>
      </section>

      {/* Tech stack section */}
      <motion.section
        className="py-20 z-10 relative"
        initial={mounted ? { opacity: 0 } : { opacity: 1 }}
        whileInView={mounted ? { opacity: 1 } : {}}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <GradientHeading className="mx-auto justify-center" from="from-primary" via="via-secondary" to="to-accent">
              Built With Modern Tech
            </GradientHeading>
          </div>

          <motion.p
            className="text-center text-foreground/80 mb-12 max-w-3xl mx-auto"
            initial={mounted ? { opacity: 0 } : { opacity: 1 }}
            whileInView={mounted ? { opacity: 1 } : {}}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A powerful stack of technologies to provide a seamless experience
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Next.js 15", icon: "/icons/nextjs.svg", color: "from-primary to-secondary" },
              { name: "Supabase", icon: "/icons/supabase.svg", color: "from-accent/80 to-secondary" },
              { name: "Stripe", icon: "/icons/stripe.svg", color: "from-primary to-accent/80" },
              { name: "ComfyUI", icon: "/icons/comfyui.svg", color: "from-secondary to-primary" },
              { name: "Tailwind CSS", icon: "/icons/tailwind.svg", color: "from-accent/80 to-primary" },
              { name: "TypeScript", icon: "/icons/typescript.svg", color: "from-secondary to-accent/80" },
              { name: "Pixio API", icon: "/icons/pixio.svg", color: "from-primary to-secondary" },
              { name: "ShadcnUI", icon: "/icons/shadcn.svg", color: "from-accent/80 to-primary" },
            ].map((tech, index) => (
              <MouseTrackCard key={tech.name}>
                <motion.div
                  className="glass-card p-4 text-center backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                  initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                  whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <div className="text-center">
                    <div className="h-12 flex items-center justify-center mb-2">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${tech.color} rounded-md flex items-center justify-center text-white bg-opacity-90`}
                      >
                        {tech.name[0]}
                      </div>
                    </div>
                    <p className="font-medium">{tech.name}</p>
                  </div>
                </motion.div>
              </MouseTrackCard>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA section */}
      <motion.section
        className="py-20 z-10 relative"
        initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
        whileInView={mounted ? { opacity: 1, y: 0 } : {}}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="glass-card p-8 max-w-4xl mx-auto border border-white/20 dark:border-white/10 backdrop-blur-lg relative overflow-hidden rounded-xl"
            initial={mounted ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
            whileInView={mounted ? { opacity: 1, scale: 1 } : {}}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated highlights - client-side only */}
            {mounted && (
              <>
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse opacity-70"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse opacity-70" style={{ animationDelay: '1s' }}></div>
              </>
            )}

            <motion.div
              className="relative z-10"
              initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              whileInView={mounted ? { opacity: 1, y: 0 } : {}}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-xl w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-primary" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Ready to Create with AI?
              </h2>

              <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
                Start generating stunning images and videos today with our powerful AI machines and the Pixio API.
              </p>

              <MagneticButton className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white hover:opacity-90 hover:shadow-lg transition-all shadow-md rounded-md py-2 px-6 font-medium">
                <Link href={isAuthenticated ? "/dashboard" : "/signup"} className="flex items-center">
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </MagneticButton>
            </motion.div>
            
          </motion.div>
          
        </div>
       
      </motion.section>
      
    </>
  );
}
