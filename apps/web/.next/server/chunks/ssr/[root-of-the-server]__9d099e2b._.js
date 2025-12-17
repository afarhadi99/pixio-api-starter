module.exports = {

"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/punycode [external] (punycode, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[project]/packages/supabase/src/lib/server.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/supabase/server.ts
__turbopack_context__.s({
    "createClient": (()=>createClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://eskcmosgdvrkultpuljo.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVza2Ntb3NnZHZya3VsdHB1bGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NDQ5MzIsImV4cCI6MjA4MTQyMDkzMn0.WI3zZ7w6XOPA_cxzemInP0EIaQADMbj5kzpFXJtHZGQ"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // This will happen if we're inside a Server Component
                // This can be ignored if middleware is refreshing sessions
                }
            }
        }
    });
}
}}),
"[project]/apps/web/src/lib/validators/auth.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/validators/auth.ts
__turbopack_context__.s({
    "loginSchema": (()=>loginSchema),
    "signupSchema": (()=>signupSchema),
    "updateProfileSchema": (()=>updateProfileSchema)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/lib/index.mjs [app-rsc] (ecmascript)");
;
const loginSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string().email({
        message: 'Please enter a valid email address'
    }),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string().min(1, {
        message: 'Password is required'
    })
});
const signupSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string().email({
        message: 'Please enter a valid email address'
    }),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string().min(8, {
        message: 'Password must be at least 8 characters'
    }),
    full_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string().min(1, {
        message: 'Name is required'
    }).optional()
});
const updateProfileSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].object({
    full_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string().min(1, {
        message: 'Name is required'
    }),
    avatar_url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string().optional()
});
}}),
"[project]/apps/web/src/lib/config/pricing.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/config/pricing.ts
__turbopack_context__.s({
    "CREDIT_PACKS": (()=>CREDIT_PACKS),
    "PRICE_ID_MAP": (()=>PRICE_ID_MAP),
    "PRICING_TIERS": (()=>PRICING_TIERS),
    "STRIPE_PRICE_IDS": (()=>STRIPE_PRICE_IDS),
    "getTierById": (()=>getTierById),
    "getTierByPriceId": (()=>getTierByPriceId)
});
const STRIPE_PRICE_IDS = {
    PRO_MONTHLY: ("TURBOPACK compile-time value", "test") || '',
    PRO_YEARLY: ("TURBOPACK compile-time value", "test") || '',
    BUSINESS_MONTHLY: ("TURBOPACK compile-time value", "test") || '',
    BUSINESS_YEARLY: ("TURBOPACK compile-time value", "test") || '',
    // Credit pack price IDs
    CREDIT_PACK_1000: ("TURBOPACK compile-time value", "test") || '',
    CREDIT_PACK_2500: ("TURBOPACK compile-time value", "test") || '',
    CREDIT_PACK_5000: ("TURBOPACK compile-time value", "test") || ''
};
const CREDIT_PACKS = [
    {
        id: 'credits-1000',
        name: '1000 Credits',
        description: 'Top up with a small credit pack',
        amount: 1000,
        price: 1000,
        priceId: STRIPE_PRICE_IDS.CREDIT_PACK_1000
    },
    {
        id: 'credits-2500',
        name: '2500 Credits',
        description: 'Best value for regular users',
        amount: 2500,
        price: 2500,
        priceId: STRIPE_PRICE_IDS.CREDIT_PACK_2500
    },
    {
        id: 'credits-5000',
        name: '5000 Credits',
        description: 'Best value for power users',
        amount: 5000,
        price: 5000,
        priceId: STRIPE_PRICE_IDS.CREDIT_PACK_5000
    }
];
// Check if price IDs are configured
const isPricingConfigured = ()=>{
    return STRIPE_PRICE_IDS.PRO_MONTHLY && STRIPE_PRICE_IDS.PRO_YEARLY && STRIPE_PRICE_IDS.BUSINESS_MONTHLY && STRIPE_PRICE_IDS.BUSINESS_YEARLY;
};
// Show warning if price IDs are not configured in production
if (("TURBOPACK compile-time value", "development") === 'production' && !isPricingConfigured()) {
    "TURBOPACK unreachable";
}
const PRICING_TIERS = [
    {
        id: 'free',
        name: 'Free',
        description: 'Essential features for individuals',
        credits: 500,
        features: [
            'Basic dashboard access',
            'Limited access to features',
            'Community support',
            '500 credits per month'
        ],
        popular: false,
        pricing: {
            monthly: {
                priceId: null,
                amount: null
            },
            yearly: {
                priceId: null,
                amount: null
            }
        }
    },
    {
        id: 'pro',
        name: 'Pro',
        description: 'Perfect for professionals',
        credits: 3000,
        features: [
            'Everything in Free',
            'Advanced features',
            'Priority support',
            'Extended usage limits',
            '3000 credits per month'
        ],
        popular: true,
        pricing: {
            monthly: {
                priceId: STRIPE_PRICE_IDS.PRO_MONTHLY || null,
                amount: 2900
            },
            yearly: {
                priceId: STRIPE_PRICE_IDS.PRO_YEARLY || null,
                amount: 29000,
                discount: 16
            }
        }
    },
    {
        id: 'business',
        name: 'Business',
        description: 'For teams and organizations',
        credits: 6000,
        features: [
            'Everything in Pro',
            'Enterprise features',
            'Dedicated support',
            'Custom integrations',
            'Team management',
            '6000 credits per month'
        ],
        popular: false,
        pricing: {
            monthly: {
                priceId: STRIPE_PRICE_IDS.BUSINESS_MONTHLY || null,
                amount: 5900
            },
            yearly: {
                priceId: STRIPE_PRICE_IDS.BUSINESS_YEARLY || null,
                amount: 59000,
                discount: 16
            }
        }
    }
];
function getTierById(id) {
    return PRICING_TIERS.find((tier)=>tier.id === id);
}
const PRICE_ID_MAP = {};
// Populate the price ID map
PRICING_TIERS.forEach((tier)=>{
    // Add monthly price ID if exists
    if (tier.pricing.monthly.priceId) {
        PRICE_ID_MAP[tier.pricing.monthly.priceId] = {
            tierId: tier.id,
            interval: 'monthly'
        };
    }
    // Add yearly price ID if exists
    if (tier.pricing.yearly.priceId) {
        PRICE_ID_MAP[tier.pricing.yearly.priceId] = {
            tierId: tier.id,
            interval: 'yearly'
        };
    }
});
function getTierByPriceId(priceId) {
    if (!priceId) {
        // Default to free tier with no interval
        const freeTier = getTierById('free');
        return {
            tier: freeTier,
            interval: undefined
        };
    }
    const priceInfo = PRICE_ID_MAP[priceId];
    if (!priceInfo) {
        // Price ID not found in our configuration
        return {
            tier: undefined,
            interval: undefined
        };
    }
    const tier = getTierById(priceInfo.tierId);
    return {
        tier,
        interval: priceInfo.interval
    };
}
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/child_process [external] (child_process, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}}),
"[project]/packages/supabase/src/lib/admin.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/supabase/admin.ts
__turbopack_context__.s({
    "createOrRetrieveCustomer": (()=>createOrRetrieveCustomer),
    "deletePriceRecord": (()=>deletePriceRecord),
    "deleteProductRecord": (()=>deleteProductRecord),
    "manageSubscriptionStatusChange": (()=>manageSubscriptionStatusChange),
    "supabaseAdmin": (()=>supabaseAdmin),
    "upsertPriceRecord": (()=>upsertPriceRecord),
    "upsertProductRecord": (()=>upsertProductRecord)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stripe$2f$esm$2f$stripe$2e$esm$2e$node$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stripe/esm/stripe.esm.node.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$credits$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/credits.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$config$2f$pricing$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/config/pricing.ts [app-rsc] (ecmascript)");
;
;
;
;
const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://eskcmosgdvrkultpuljo.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY);
// Initialize Stripe
const stripe = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stripe$2f$esm$2f$stripe$2e$esm$2e$node$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"](process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-03-31.basil'
});
async function createOrRetrieveCustomer({ uuid, email }) {
    const { data: existingCustomer, error: customerError } = await supabaseAdmin.from('customers').select('stripe_customer_id').eq('id', uuid).single();
    if (existingCustomer?.stripe_customer_id) {
        return existingCustomer.stripe_customer_id;
    }
    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
        email,
        metadata: {
            supabaseUUID: uuid
        }
    });
    // Insert the customer into our database
    const { error } = await supabaseAdmin.from('customers').insert([
        {
            id: uuid,
            stripe_customer_id: customer.id
        }
    ]);
    if (error) throw error;
    return customer.id;
}
async function upsertProductRecord(product) {
    const { error } = await supabaseAdmin.from('products').upsert([
        {
            id: product.id,
            active: product.active,
            name: product.name,
            description: product.description ?? null,
            image: product.images?.[0] ?? null,
            metadata: product.metadata
        }
    ]);
    if (error) throw error;
    console.log(`Product inserted/updated: ${product.id}`);
}
async function deleteProductRecord(productId) {
    const { error } = await supabaseAdmin.from('products').delete().eq('id', productId);
    if (error) throw error;
    console.log(`Product deleted: ${productId}`);
}
async function upsertPriceRecord(price) {
    // Extract interval details
    const interval = price.recurring?.interval;
    const intervalCount = price.recurring?.interval_count ?? null;
    // Extract price type
    const type = price.type;
    const { error } = await supabaseAdmin.from('prices').upsert([
        {
            id: price.id,
            product_id: typeof price.product === 'string' ? price.product : '',
            active: price.active,
            currency: price.currency,
            description: price.nickname ?? null,
            type,
            unit_amount: price.unit_amount ?? null,
            interval,
            interval_count: intervalCount,
            trial_period_days: price.recurring?.trial_period_days ?? null,
            metadata: price.metadata
        }
    ]);
    if (error) throw error;
    console.log(`Price inserted/updated: ${price.id}`);
}
async function deletePriceRecord(priceId) {
    const { error } = await supabaseAdmin.from('prices').delete().eq('id', priceId);
    if (error) throw error;
    console.log(`Price deleted: ${priceId}`);
}
async function manageSubscriptionStatusChange(subscriptionId, customerId, createAction = false) {
    try {
        // Get customer's UUID from mapping table
        const { data: customerData, error: customerError } = await supabaseAdmin.from('customers').select('id').eq('stripe_customer_id', customerId).single();
        if (customerError || !customerData?.id) {
            console.error(`Customer not found: ${customerId}`);
            throw new Error(`Customer not found: ${customerId}`);
        }
        const { id: uuid } = customerData;
        // Retrieve subscription details from Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: [
                'default_payment_method',
                'items.data.price',
                'items.data.price.product'
            ]
        });
        // Handle as plain object to avoid TypeScript issues
        const subscription = stripeSubscription;
        // Get the price and product details from the subscription
        const priceId = subscription.items.data[0].price.id;
        const price = subscription.items.data[0].price;
        const product = subscription.items.data[0].price.product;
        // Check if the price exists in our database
        const { data: existingPrice } = await supabaseAdmin.from('prices').select('id').eq('id', priceId).maybeSingle();
        // If price doesn't exist, insert both the product and price first
        if (!existingPrice) {
            console.log(`Price ${priceId} not found in database. Adding to database first...`);
            // First check if the product exists
            const { data: existingProduct } = await supabaseAdmin.from('products').select('id').eq('id', product.id).maybeSingle();
            // Insert product if it doesn't exist
            if (!existingProduct) {
                console.log(`Product ${product.id} not found. Adding product...`);
                await supabaseAdmin.from('products').upsert([
                    {
                        id: product.id,
                        active: product.active,
                        name: product.name,
                        description: product.description ?? null,
                        image: product.images?.[0] ?? null,
                        metadata: product.metadata
                    }
                ]);
            }
            // Then insert the price
            console.log(`Adding price ${priceId}...`);
            await supabaseAdmin.from('prices').upsert([
                {
                    id: priceId,
                    product_id: product.id,
                    active: price.active,
                    currency: price.currency,
                    description: price.nickname ?? null,
                    type: price.type,
                    unit_amount: price.unit_amount ?? null,
                    interval: price.recurring?.interval ?? null,
                    interval_count: price.recurring?.interval_count ?? null,
                    trial_period_days: price.recurring?.trial_period_days ?? null,
                    metadata: price.metadata
                }
            ]);
        }
        // Define helper function inline
        const safeToISOString = (timestamp)=>{
            if (timestamp === null || timestamp === undefined) return null;
            try {
                return new Date(timestamp * 1000).toISOString();
            } catch (error) {
                console.error(`Invalid timestamp: ${timestamp}`, error);
                return null;
            }
        };
        // Current time as fallback
        const now = new Date().toISOString();
        // Upsert the subscription in the database
        const subscriptionData = {
            id: subscription.id,
            user_id: uuid,
            status: subscription.status,
            metadata: subscription.metadata,
            price_id: priceId,
            quantity: subscription.items.data[0].quantity,
            cancel_at_period_end: subscription.cancel_at_period_end,
            cancel_at: subscription.cancel_at ? safeToISOString(subscription.cancel_at) : null,
            canceled_at: subscription.canceled_at ? safeToISOString(subscription.canceled_at) : null,
            current_period_start: safeToISOString(subscription.current_period_start) || now,
            current_period_end: safeToISOString(subscription.current_period_end) || now,
            created: safeToISOString(subscription.created) || now,
            ended_at: subscription.ended_at ? safeToISOString(subscription.ended_at) : null,
            trial_start: subscription.trial_start ? safeToISOString(subscription.trial_start) : null,
            trial_end: subscription.trial_end ? safeToISOString(subscription.trial_end) : null
        };
        console.log(`Upserting subscription ${subscription.id} for user ${uuid}`);
        const { error } = await supabaseAdmin.from('subscriptions').upsert([
            subscriptionData
        ]);
        if (error) {
            console.error(`Supabase subscription upsert error:`, error);
            throw error;
        }
        console.log(`Subscription ${subscription.id} successfully updated for user ${uuid}`);
        // After subscription is processed, reset subscription credits based on tier
        if (subscription.status === 'active' || subscription.status === 'trialing') {
            // Get the product details to determine the tier
            const { tier } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$config$2f$pricing$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTierByPriceId"])(priceId);
            if (tier) {
                console.log(`Resetting credits for user ${uuid} to tier ${tier.id} level`);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$credits$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resetSubscriptionCredits"])(uuid, tier.id);
            }
        }
        return subscription;
    } catch (error) {
        console.error('Error in manageSubscriptionStatusChange:', error);
        throw error;
    }
}
}}),
"[project]/apps/web/src/lib/credits.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/credits.ts
__turbopack_context__.s({
    "addPurchasedCredits": (()=>addPurchasedCredits),
    "getCreditsByTier": (()=>getCreditsByTier),
    "getUserCredits": (()=>getUserCredits),
    "initializeUserCredits": (()=>initializeUserCredits),
    "resetSubscriptionCredits": (()=>resetSubscriptionCredits),
    "useCredits": (()=>useCredits)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/supabase/src/lib/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$config$2f$pricing$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/config/pricing.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/supabase/src/lib/admin.ts [app-rsc] (ecmascript)");
;
;
;
;
function getCreditsByTier(tier) {
    const tierData = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$config$2f$pricing$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PRICING_TIERS"].find((t)=>t.id === tier);
    return tierData?.credits || 0;
}
const getUserCredits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return {
            subscriptionCredits: 0,
            purchasedCredits: 0,
            total: 0
        };
    }
    // Fetch user credits
    const { data: userData, error: userDataError } = await supabase.from('users').select('subscription_credits, purchased_credits').eq('id', user.id).single();
    if (userDataError || !userData) {
        console.error('Error fetching user credits:', userDataError?.message);
        return {
            subscriptionCredits: 0,
            purchasedCredits: 0,
            total: 0
        };
    }
    const subscriptionCredits = userData.subscription_credits || 0;
    const purchasedCredits = userData.purchased_credits || 0;
    return {
        subscriptionCredits,
        purchasedCredits,
        total: subscriptionCredits + purchasedCredits
    };
});
async function resetSubscriptionCredits(userId, tier) {
    const creditAmount = getCreditsByTier(tier);
    console.log(`Resetting subscription credits for user ${userId} to ${creditAmount} (${tier} tier)`);
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('users').update({
        subscription_credits: creditAmount,
        last_credits_reset_date: new Date().toISOString()
    }).eq('id', userId);
    if (error) {
        console.error('Error resetting subscription credits:', error.message);
        return false;
    }
    console.log(`Successfully reset credits to ${creditAmount} for user ${userId}`);
    return true;
}
async function addPurchasedCredits(userId, amount) {
    // Get current purchased credits
    const { data: userData, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('users').select('purchased_credits').eq('id', userId).single();
    if (fetchError) {
        console.error('Error fetching user data:', fetchError.message);
        return false;
    }
    const currentCredits = userData?.purchased_credits || 0;
    const newTotal = currentCredits + amount;
    console.log(`Updating user ${userId} from ${currentCredits} to ${newTotal} purchased credits`);
    // Update purchased credits
    const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('users').update({
        purchased_credits: newTotal
    }).eq('id', userId);
    if (updateError) {
        console.error('Error updating purchased credits:', updateError.message);
        return false;
    }
    console.log(`Successfully updated credits to ${newTotal}`);
    return true;
}
async function useCredits(userId, amount, description = '') {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // Get current credits
    const { data: userData, error: fetchError } = await supabase.from('users').select('subscription_credits, purchased_credits').eq('id', userId).single();
    if (fetchError) {
        console.error('Error fetching user credits:', fetchError.message);
        return false;
    }
    const subscriptionCredits = userData?.subscription_credits || 0;
    const purchasedCredits = userData?.purchased_credits || 0;
    // Check if user has enough credits
    if (subscriptionCredits + purchasedCredits < amount) {
        return false; // Not enough credits
    }
    // Use subscription credits first
    let remainingAmount = amount;
    let newSubscriptionCredits = subscriptionCredits;
    let newPurchasedCredits = purchasedCredits;
    if (subscriptionCredits >= remainingAmount) {
        newSubscriptionCredits -= remainingAmount;
        remainingAmount = 0;
    } else {
        remainingAmount -= subscriptionCredits;
        newSubscriptionCredits = 0;
        // Use purchased credits for the remainder
        newPurchasedCredits -= remainingAmount;
    }
    // Update credits using admin client for more reliable updates
    const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('users').update({
        subscription_credits: newSubscriptionCredits,
        purchased_credits: newPurchasedCredits
    }).eq('id', userId);
    if (updateError) {
        console.error('Error updating credits:', updateError.message);
        return false;
    }
    // Record usage
    const { error: usageError } = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('credit_usage').insert({
        user_id: userId,
        amount,
        description
    });
    if (usageError) {
        console.error('Error recording credit usage:', usageError.message);
    }
    return true;
}
async function initializeUserCredits(userId) {
    // Free tier credits by default
    const initialCredits = getCreditsByTier('free');
    console.log(`Initializing credits for new user ${userId} with ${initialCredits} credits`);
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('users').update({
        subscription_credits: initialCredits,
        purchased_credits: 0,
        last_credits_reset_date: new Date().toISOString()
    }).eq('id', userId);
    if (error) {
        console.error('Error initializing user credits:', error.message);
        return false;
    }
    console.log(`Successfully initialized ${initialCredits} credits for user ${userId}`);
    return true;
}
}}),
"[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/actions/auth.actions.ts
/* __next_internal_action_entry_do_not_use__ [{"00fc883485173d4ad849041dce01f6a7a935bbb0cd":"logout","40028f1c67f846ebc4c7ecf11a52cdea7b085264e0":"login","40331142ec4096e329fe1ba7bf7d8ce39923afd777":"signup","40f7f6cafd083d58d8432e7822c72a041710641dc1":"updateProfile"},"",""] */ __turbopack_context__.s({
    "login": (()=>login),
    "logout": (()=>logout),
    "signup": (()=>signup),
    "updateProfile": (()=>updateProfile)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/supabase/src/lib/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$validators$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/validators/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$credits$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/credits.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
async function login(values) {
    // Validate input
    const validatedFields = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$validators$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginSchema"].safeParse(values);
    if (!validatedFields.success) {
        return {
            error: 'Invalid input'
        };
    }
    const { email, password } = validatedFields.data;
    // Call cookies to prevent caching
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) {
        return {
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/dashboard');
}
async function signup(values) {
    // Validate input
    const validatedFields = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$validators$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signupSchema"].safeParse(values);
    if (!validatedFields.success) {
        return {
            error: 'Invalid input'
        };
    }
    const { email, password, full_name } = validatedFields.data;
    // Call cookies to prevent caching
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${("TURBOPACK compile-time value", "https://unlovably-bullish-giavanna.ngrok-free.dev")}/auth/callback`,
            data: {
                full_name
            }
        }
    });
    if (error) {
        return {
            error: error.message
        };
    }
    // Initialize credits for the new user
    if (data.user) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$credits$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initializeUserCredits"])(data.user.id);
    }
    // Check if email confirmation is required
    // Redirect to a confirmation page if needed
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/dashboard');
}
async function logout() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    await supabase.auth.signOut();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/');
}
async function updateProfile(values) {
    // Validate input
    const validatedFields = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$validators$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateProfileSchema"].safeParse(values);
    if (!validatedFields.success) {
        return {
            error: 'Invalid input'
        };
    }
    const { full_name, avatar_url } = validatedFields.data;
    // Call cookies to prevent caching
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return {
            error: 'Authentication error'
        };
    }
    // Update user metadata
    const { error: updateAuthError } = await supabase.auth.updateUser({
        data: {
            full_name,
            avatar_url
        }
    });
    if (updateAuthError) {
        return {
            error: updateAuthError.message
        };
    }
    // Update public profile
    const { error: updateProfileError } = await supabase.from('users').update({
        full_name,
        avatar_url
    }).eq('id', user.id);
    if (updateProfileError) {
        return {
            error: updateProfileError.message
        };
    }
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    login,
    signup,
    logout,
    updateProfile
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(login, "40028f1c67f846ebc4c7ecf11a52cdea7b085264e0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signup, "40331142ec4096e329fe1ba7bf7d8ce39923afd777", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logout, "00fc883485173d4ad849041dce01f6a7a935bbb0cd", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateProfile, "40f7f6cafd083d58d8432e7822c72a041710641dc1", null);
}}),
"[project]/apps/web/.next-internal/server/app/(auth)/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)");
;
}}),
"[project]/apps/web/.next-internal/server/app/(auth)/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f28$auth$292f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/web/.next-internal/server/app/(auth)/login/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/apps/web/.next-internal/server/app/(auth)/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "40028f1c67f846ebc4c7ecf11a52cdea7b085264e0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["login"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f28$auth$292f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/web/.next-internal/server/app/(auth)/login/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/apps/web/.next-internal/server/app/(auth)/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "40028f1c67f846ebc4c7ecf11a52cdea7b085264e0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f28$auth$292f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40028f1c67f846ebc4c7ecf11a52cdea7b085264e0"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f28$auth$292f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/apps/web/.next-internal/server/app/(auth)/login/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f28$auth$292f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/apps/web/.next-internal/server/app/(auth)/login/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/apps/web/src/app/favicon.ico.mjs { IMAGE => \"[project]/apps/web/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/src/app/favicon.ico.mjs { IMAGE => \"[project]/apps/web/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/apps/web/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/apps/web/src/app/(auth)/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/src/app/(auth)/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/apps/web/src/app/(auth)/login/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/web/src/app/(auth)/login/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/app/(auth)/login/page.tsx <module evaluation>", "default");
}}),
"[project]/apps/web/src/app/(auth)/login/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/web/src/app/(auth)/login/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/app/(auth)/login/page.tsx", "default");
}}),
"[project]/apps/web/src/app/(auth)/login/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f28$auth$292f$login$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/src/app/(auth)/login/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f28$auth$292f$login$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/apps/web/src/app/(auth)/login/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f28$auth$292f$login$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/apps/web/src/app/(auth)/login/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/src/app/(auth)/login/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__9d099e2b._.js.map