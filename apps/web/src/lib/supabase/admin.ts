// App-level shim binding the service-role client + Stripe singleton to the
// @pixio/billing helpers, preserving the original `@/lib/supabase/admin` API.
import { createAdminClientFromEnv } from '@pixio/database/admin';
import {
  createOrRetrieveCustomer as _createOrRetrieveCustomer,
  upsertProductRecord as _upsertProductRecord,
  deleteProductRecord as _deleteProductRecord,
  upsertPriceRecord as _upsertPriceRecord,
  deletePriceRecord as _deletePriceRecord,
  manageSubscriptionStatusChange as _manageSubscriptionStatusChange,
  type Stripe,
} from '@pixio/billing';
import { stripe } from '@/lib/stripe/client';

export const supabaseAdmin = createAdminClientFromEnv();

export const createOrRetrieveCustomer = (args: { uuid: string; email: string }) =>
  _createOrRetrieveCustomer(supabaseAdmin, stripe, args);

export const upsertProductRecord = (product: Stripe.Product) =>
  _upsertProductRecord(supabaseAdmin, product);

export const deleteProductRecord = (productId: string) =>
  _deleteProductRecord(supabaseAdmin, productId);

export const upsertPriceRecord = (price: Stripe.Price) => _upsertPriceRecord(supabaseAdmin, price);

export const deletePriceRecord = (priceId: string) => _deletePriceRecord(supabaseAdmin, priceId);

export const manageSubscriptionStatusChange = (
  subscriptionId: string,
  customerId: string,
  createAction = false,
) => _manageSubscriptionStatusChange(supabaseAdmin, stripe, subscriptionId, customerId, createAction);
