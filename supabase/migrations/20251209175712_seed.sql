-- Create ENUM types for subscription status and pricing details
CREATE TYPE public.subscription_status AS ENUM ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');
CREATE TYPE public.pricing_type AS ENUM ('one_time', 'recurring');
CREATE TYPE public.pricing_plan_interval AS ENUM ('day', 'week', 'month', 'year');

-- USERS Table: Stores public user profile information.
CREATE TABLE public.users (
 id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 full_name text,
 avatar_url text,
 billing_address jsonb,
 payment_method jsonb
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access." ON public.users FOR SELECT USING (true);
CREATE POLICY "Can update own user data." ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Can view own user data." ON public.users FOR SELECT USING (auth.uid() = id);

-- Function to automatically create a public user profile when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
 INSERT INTO public.users (id, full_name, avatar_url)
 VALUES (
   new.id,
   new.raw_user_meta_data->>'full_name',
   new.raw_user_meta_data->>'avatar_url'
 );
 RETURN new;
END;
$$;

-- Trigger the function after user creation
CREATE TRIGGER on_auth_user_created
 AFTER INSERT ON auth.users
 FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- CUSTOMERS Table: Maps Supabase auth users to Stripe customer IDs. (Private)
CREATE TABLE public.customers (
 id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 stripe_customer_id text UNIQUE
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
-- No policies needed if accessed only via service_role key.
-- If accessed by users, add: CREATE POLICY "Can view own customer data." ON public.customers FOR SELECT USING (auth.uid() = id);

-- PRODUCTS Table: Stores product information synced from Stripe.
CREATE TABLE public.products (
 id text PRIMARY KEY, -- Stripe Product ID
 active boolean,
 name text,
 description text,
 image text,          -- Stripe Product Image URL
 metadata jsonb
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access." ON public.products FOR SELECT USING (true);

-- PRICES Table: Stores price information synced from Stripe.
CREATE TABLE public.prices (
 id text PRIMARY KEY, -- Stripe Price ID
 product_id text REFERENCES public.products(id) ON DELETE CASCADE,
 active boolean,
 description text,
 unit_amount bigint, -- Amount in cents/smallest currency unit
 currency text CHECK (char_length(currency) = 3),
 type public.pricing_type,
 interval public.pricing_plan_interval,
 interval_count integer,
 trial_period_days integer,
 metadata jsonb
);
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access." ON public.prices FOR SELECT USING (true);

-- SUBSCRIPTIONS Table: Stores user subscription information synced from Stripe.
CREATE TABLE public.subscriptions (
 id text PRIMARY KEY, -- Stripe Subscription ID
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 status public.subscription_status,
 metadata jsonb,
 price_id text REFERENCES public.prices(id),
 quantity integer,
 cancel_at_period_end boolean,
 created timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
 current_period_start timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
 current_period_end timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
 ended_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
 cancel_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
 canceled_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
 trial_start timestamp with time zone DEFAULT timezone('utc'::text, now()),
 trial_end timestamp with time zone DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Can view own subscription data." ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Add credit-related fields to users table
ALTER TABLE public.users 
ADD COLUMN subscription_credits INTEGER DEFAULT 0,
ADD COLUMN purchased_credits INTEGER DEFAULT 0,
ADD COLUMN last_credits_reset_date TIMESTAMP WITH TIME ZONE;

-- Create table for credit purchases
CREATE TABLE public.credit_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  price_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.credit_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Can view own credit purchases" ON public.credit_purchases FOR SELECT USING (auth.uid() = user_id);

-- Create table for credit usage
CREATE TABLE public.credit_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.credit_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Can view own credit usage" ON public.credit_usage FOR SELECT USING (auth.uid() = user_id);

-- Table for storing generated media
CREATE TABLE public.generated_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  credits_used INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.generated_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Can view own media" ON public.generated_media FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Can insert own media" ON public.generated_media FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ensure proper policies for service role updates
CREATE POLICY "Allow service role to update media" 
  ON public.generated_media 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Ensure users can update their own media
CREATE POLICY "Can update own media" 
  ON public.generated_media 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

      ALTER TABLE public.generated_media
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT NULL;

  ALTER TABLE public.generated_media
ADD COLUMN IF NOT EXISTS start_image_url TEXT NULL,
ADD COLUMN IF NOT EXISTS end_image_url TEXT NULL;