-- Grant free-tier credits to every new user at the database level.
--
-- Previously only the web app granted starter credits (via initializeUserCredits
-- after signup), so accounts created from the mobile app started at 0 credits.
-- Moving this into the handle_new_user trigger makes credit initialization
-- platform-agnostic: web AND mobile signups start with the same balance.
--
-- 500 == the free tier allocation (see @pixio/config PRICING_TIERS / getCreditsByTier('free')).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    full_name,
    avatar_url,
    subscription_credits,
    purchased_credits,
    last_credits_reset_date
  )
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    500,
    0,
    timezone('utc'::text, now())
  );
  RETURN new;
END;
$$;

-- Backfill accounts that were created before this change and never received
-- their free credits (e.g. existing mobile signups). Only touch untouched,
-- never-initialized rows so we don't clobber spent/purchased balances.
UPDATE public.users
SET
  subscription_credits = 500,
  last_credits_reset_date = COALESCE(last_credits_reset_date, timezone('utc'::text, now()))
WHERE COALESCE(subscription_credits, 0) = 0
  AND COALESCE(purchased_credits, 0) = 0
  AND last_credits_reset_date IS NULL;
