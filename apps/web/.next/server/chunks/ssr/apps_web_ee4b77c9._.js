module.exports = {

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
(()=>{
    const e = new Error("Cannot find module '@/lib/supabase/server'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$config$2f$pricing$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/config/pricing.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/supabase/admin'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
;
function getCreditsByTier(tier) {
    const tierData = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$config$2f$pricing$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PRICING_TIERS"].find((t)=>t.id === tier);
    return tierData?.credits || 0;
}
const getUserCredits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const supabase = await createClient();
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
    const { error } = await supabaseAdmin.from('users').update({
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
    const { data: userData, error: fetchError } = await supabaseAdmin.from('users').select('purchased_credits').eq('id', userId).single();
    if (fetchError) {
        console.error('Error fetching user data:', fetchError.message);
        return false;
    }
    const currentCredits = userData?.purchased_credits || 0;
    const newTotal = currentCredits + amount;
    console.log(`Updating user ${userId} from ${currentCredits} to ${newTotal} purchased credits`);
    // Update purchased credits
    const { error: updateError } = await supabaseAdmin.from('users').update({
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
    const supabase = await createClient();
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
    const { error: updateError } = await supabaseAdmin.from('users').update({
        subscription_credits: newSubscriptionCredits,
        purchased_credits: newPurchasedCredits
    }).eq('id', userId);
    if (updateError) {
        console.error('Error updating credits:', updateError.message);
        return false;
    }
    // Record usage
    const { error: usageError } = await supabaseAdmin.from('credit_usage').insert({
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
    const { error } = await supabaseAdmin.from('users').update({
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
(()=>{
    const e = new Error("Cannot find module '@/lib/supabase/server'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
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
    const supabase = await createClient();
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
    const supabase = await createClient();
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
    const supabase = await createClient();
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
    const supabase = await createClient();
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
"[project]/apps/web/.next-internal/server/app/(marketing)/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)");
;
}}),
"[project]/apps/web/.next-internal/server/app/(marketing)/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f28$marketing$292f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/web/.next-internal/server/app/(marketing)/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/apps/web/.next-internal/server/app/(marketing)/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00fc883485173d4ad849041dce01f6a7a935bbb0cd": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logout"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f28$marketing$292f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/web/.next-internal/server/app/(marketing)/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/apps/web/.next-internal/server/app/(marketing)/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00fc883485173d4ad849041dce01f6a7a935bbb0cd": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f28$marketing$292f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00fc883485173d4ad849041dce01f6a7a935bbb0cd"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f28$marketing$292f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/apps/web/.next-internal/server/app/(marketing)/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f28$marketing$292f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/apps/web/.next-internal/server/app/(marketing)/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/web/src/lib/actions/auth.actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
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
"[project]/apps/web/src/app/(marketing)/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/src/app/(marketing)/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/apps/web/src/app/(marketing)/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/web/src/app/(marketing)/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/app/(marketing)/page.tsx <module evaluation>", "default");
}}),
"[project]/apps/web/src/app/(marketing)/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/web/src/app/(marketing)/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/app/(marketing)/page.tsx", "default");
}}),
"[project]/apps/web/src/app/(marketing)/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f28$marketing$292f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/src/app/(marketing)/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f28$marketing$292f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/apps/web/src/app/(marketing)/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f28$marketing$292f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/apps/web/src/app/(marketing)/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/src/app/(marketing)/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=apps_web_ee4b77c9._.js.map