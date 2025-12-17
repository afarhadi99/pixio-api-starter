module.exports = {

"[project]/apps/web/src/lib/config/pricing.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
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
"[project]/apps/web/src/app/(marketing)/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/app/(marketing)/page.tsx
__turbopack_context__.s({
    "default": (()=>LandingPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-scroll.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-transform.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$template$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-motion-template.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-spring.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$in$2d$view$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/utils/use-in-view.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/index.ts [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$config$2f$pricing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/config/pricing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-ssr] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$github$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Github$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/github.js [app-ssr] (ecmascript) <export default as Github>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/supabase/src/lib/client.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
// --- MouseTrackCard with Border Glow ---
const MouseTrackCard = ({ children, className })=>{
    const cardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [mousePosition, setMousePosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [isHovered, setIsHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Springs for animation - always initialize them
    const springConfig = {
        stiffness: 150,
        damping: 20
    };
    const rotateX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpring"])(0, springConfig);
    const rotateY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpring"])(0, springConfig);
    // Always create the motion template regardless of hover state
    const transform = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$template$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMotionTemplate"]`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`;
    // Client-side effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setIsMounted(true);
    }, []);
    const handleMouseMove = (e)=>{
        if (!cardRef.current || !isHovered) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateXValue = (y - centerY) / centerY * -8;
        const rotateYValue = (x - centerX) / centerX * 8;
        setMousePosition({
            x: rotateYValue,
            y: rotateXValue
        });
    };
    // Update spring animations
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isHovered) {
            rotateX.set(mousePosition.y);
            rotateY.set(mousePosition.x);
        } else {
            rotateX.set(0);
            rotateY.set(0);
        }
    }, [
        mousePosition,
        isHovered,
        rotateX,
        rotateY
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        ref: cardRef,
        className: `relative ${className || ''}`,
        onMouseMove: handleMouseMove,
        onMouseEnter: ()=>setIsHovered(true),
        onMouseLeave: ()=>setIsHovered(false),
        style: {
            transformStyle: "preserve-3d",
            transform
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "absolute -inset-0.5 rounded-[inherit] z-[-1]",
                style: {
                    // Apply a box shadow for the glow effect
                    boxShadow: isMounted && isHovered ? '0 0 15px 3px oklch(var(--primary) / 0.5)' // Use primary color with alpha
                     : 'none',
                    opacity: isMounted && isHovered ? 1 : 0,
                    transition: 'box-shadow 0.3s ease-in-out, opacity 0.3s ease-in-out'
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
};
// Fixed Animated Background to prevent hydration mismatch
const AnimatedBackground = ()=>{
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mousePosition, setMousePosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    // Only run on client side
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
        const handleMouseMove = (e)=>{
            // Calculate mouse position relative to viewport center
            const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
            const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
            setMousePosition({
                x,
                y
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return ()=>window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    // Use consistent deterministic values for server rendering
    // Generate fixed positions for particles to prevent hydration mismatch
    const particlePositions = Array.from({
        length: 20
    }).map((_, i)=>({
            top: `${i * 5 % 100}%`,
            left: `${i * 7 % 100}%`,
            opacity: 0.3 + i % 5 * 0.1,
            animationDuration: `${10 + i % 10}s`,
            animationDelay: `${i % 10 * 0.5}s`
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 -z-10 overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-[url('/grid.svg')] bg-[length:10px_10px] bg-repeat opacity-5",
                style: mounted ? {
                    transform: `translateX(${mousePosition.x * -5}px) translateY(${mousePosition.y * -5}px)`,
                    transition: "transform 1s cubic-bezier(0.075, 0.82, 0.165, 1)"
                } : {}
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-primary/5 filter blur-[100px] animate-float",
                style: {
                    animationDuration: '30s',
                    transform: mounted ? `translateX(${mousePosition.x * -30}px) translateY(${mousePosition.y * -30}px)` : 'none'
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-[40%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-secondary/5 filter blur-[100px] animate-float",
                style: {
                    animationDuration: '25s',
                    animationDelay: '2s',
                    transform: mounted ? `translateX(${mousePosition.x * -20}px) translateY(${mousePosition.y * -20}px)` : 'none'
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-[15%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-accent/5 filter blur-[100px] animate-float",
                style: {
                    animationDuration: '28s',
                    animationDelay: '1s',
                    transform: mounted ? `translateX(${mousePosition.x * -25}px) translateY(${mousePosition.y * -25}px)` : 'none'
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-[30%] left-[25%] w-[20vw] h-[20vw] rounded-full bg-primary/10 filter blur-[80px] animate-float",
                style: {
                    animationDuration: '20s',
                    animationDelay: '3s'
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 181,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-[60%] right-[25%] w-[25vw] h-[25vw] rounded-full bg-secondary/10 filter blur-[80px] animate-float",
                style: {
                    animationDuration: '22s',
                    animationDelay: '2.5s'
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-[15%] right-[30%] w-[10vw] h-[10vw] rounded-full bg-accent/10 filter blur-[50px] animate-float",
                style: {
                    animationDuration: '18s',
                    animationDelay: '1.5s'
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-[25%] right-[15%] w-[15vw] h-[15vw] rounded-full bg-primary/10 filter blur-[60px] animate-float",
                style: {
                    animationDuration: '15s',
                    animationDelay: '1s'
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-[45%] left-[10%] w-[12vw] h-[12vw] rounded-full bg-secondary/10 filter blur-[60px] animate-float",
                style: {
                    animationDuration: '17s',
                    animationDelay: '0.5s'
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "particles absolute inset-0 z-0",
                children: particlePositions.map((pos, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "particle absolute w-1 h-1 rounded-full bg-white/40",
                        style: {
                            top: pos.top,
                            left: pos.left,
                            opacity: pos.opacity,
                            animation: `float ${pos.animationDuration} linear infinite`,
                            animationDelay: pos.animationDelay
                        }
                    }, i, false, {
                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                        lineNumber: 192,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
        lineNumber: 142,
        columnNumber: 5
    }, this);
};
// Fixed MagneticButton - similar approach to MouseTrackCard
const MagneticButton = ({ children, className, onClick, disabled })=>{
    const buttonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [isHovered, setIsHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Always initialize the springs
    const xMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpring"])(0, {
        damping: 20,
        stiffness: 200
    });
    const yMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpring"])(0, {
        damping: 20,
        stiffness: 200
    });
    // Client-side effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setIsMounted(true);
    }, []);
    const handleMouseMove = (e)=>{
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
    const handleMouseLeave = ()=>{
        setIsHovered(false);
        setPosition({
            x: 0,
            y: 0
        });
    };
    // Update springs in useEffect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isMounted && !disabled) {
            xMotion.set(position.x);
            yMotion.set(position.y);
        } else {
            xMotion.set(0);
            yMotion.set(0);
        }
    }, [
        position,
        xMotion,
        yMotion,
        isMounted,
        disabled
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
        ref: buttonRef,
        className: className,
        onMouseMove: handleMouseMove,
        onMouseEnter: ()=>!disabled && setIsHovered(true),
        onMouseLeave: handleMouseLeave,
        onClick: onClick,
        disabled: disabled,
        style: {
            x: xMotion,
            y: yMotion,
            transition: "transform 0.1s ease"
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
        lineNumber: 262,
        columnNumber: 5
    }, this);
};
// Enhanced underlined heading with gradient
const GradientHeading = ({ children, className, from = "from-primary", via = "via-secondary", to = "to-accent" })=>{
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isInView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$in$2d$view$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useInView"])(ref, {
        once: true,
        amount: 0.5
    });
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setIsMounted(true);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        ref: ref,
        className: `relative inline-block ${className || ''}`,
        initial: isMounted ? {
            opacity: 0,
            y: 20
        } : {
            opacity: 1,
            y: 0
        },
        animate: isMounted && isInView ? {
            opacity: 1,
            y: 0
        } : {},
        transition: {
            duration: 0.8,
            ease: [
                0.22,
                1,
                0.36,
                1
            ]
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: `text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${from} ${via} ${to}`,
                children: children
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 305,
                columnNumber: 7
            }, this),
            isMounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                className: `absolute -bottom-2 left-0 h-1 bg-gradient-to-r ${from} ${via} ${to} rounded-full`,
                initial: {
                    width: "0%"
                },
                animate: isInView ? {
                    width: "100%"
                } : {
                    width: "0%"
                },
                transition: {
                    duration: 1,
                    delay: 0.2,
                    ease: [
                        0.22,
                        1,
                        0.36,
                        1
                    ]
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 309,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
        lineNumber: 298,
        columnNumber: 5
    }, this);
};
// Workflow card component
const WorkflowCard = ({ title, description, link, icon, index })=>{
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setIsMounted(true);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MouseTrackCard, {
        className: "h-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
            className: "glass-card h-full backdrop-blur-lg border border-white/20 dark:border-white/10 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all duration-300 overflow-hidden",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: isMounted ? {
                    opacity: 0,
                    y: 20
                } : {
                    opacity: 1,
                    y: 0
                },
                whileInView: isMounted ? {
                    opacity: 1,
                    y: 0
                } : {},
                viewport: {
                    once: true
                },
                transition: {
                    duration: 0.5,
                    delay: 0.1 * index
                },
                className: "h-full flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        className: "pb-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                            className: "flex items-center gap-2 text-xl",
                            children: [
                                icon,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 341,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                            lineNumber: 339,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                        lineNumber: 338,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-4 flex-grow",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                            className: "text-sm text-foreground/80",
                            children: description
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                            lineNumber: 345,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                        lineNumber: 344,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardFooter"], {
                        className: "pt-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            className: "gap-1 glass-button bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 hover:text-primary w-full justify-center group",
                            asChild: true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: link,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                        className: "h-4 w-4 group-hover:scale-110 transition-transform"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 354,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Open in Pixio API"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 355,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                lineNumber: 353,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                            lineNumber: 348,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                        lineNumber: 347,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 331,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
            lineNumber: 330,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
        lineNumber: 329,
        columnNumber: 5
    }, this);
};
const PricingSection = ({ userTierId, isAuthenticated })=>{
    const [billingInterval, setBillingInterval] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('monthly');
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const switchRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const toggleAnimation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null); // State for button loading
    // Set mounted state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setIsMounted(true);
    }, []);
    // Animate the toggle switch on initial render - only on client
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isMounted && !toggleAnimation.current && switchRef.current) {
            setTimeout(()=>{
                setBillingInterval('yearly');
                setTimeout(()=>{
                    setBillingInterval('monthly');
                    toggleAnimation.current = true;
                }, 1500);
            }, 1000);
        }
    }, [
        isMounted
    ]);
    // Function to handle subscription with redirect checkout
    const handleSubscribe = async (priceId)=>{
        // This should only be called if isAuthenticated is true
        if (!isAuthenticated) return;
        setIsLoading(priceId);
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    priceId
                })
            });
            const data = await response.json();
            if (response.ok && data.url) {
                window.location.href = data.url; // Redirect to Stripe Checkout
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(error.message || 'Something went wrong');
            setIsLoading(null);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center mb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GradientHeading, {
                        className: "mb-4 justify-center mx-auto text-center",
                        children: "Simple, Transparent Pricing"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                        lineNumber: 430,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                        className: "text-lg text-muted-foreground mb-8",
                        initial: isMounted ? {
                            opacity: 0,
                            y: 10
                        } : {
                            opacity: 1,
                            y: 0
                        },
                        whileInView: isMounted ? {
                            opacity: 1,
                            y: 0
                        } : {},
                        viewport: {
                            once: true
                        },
                        transition: {
                            duration: 0.6,
                            delay: 0.3
                        },
                        children: "Choose the perfect plan for your needs. All plans include access to Pixio API machines."
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                        lineNumber: 433,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: "flex items-center justify-center space-x-4 mb-8",
                        initial: isMounted ? {
                            opacity: 0
                        } : {
                            opacity: 1
                        },
                        whileInView: isMounted ? {
                            opacity: 1
                        } : {},
                        viewport: {
                            once: true
                        },
                        transition: {
                            duration: 0.6,
                            delay: 0.4
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-sm ${billingInterval === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`,
                                children: "Monthly"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                lineNumber: 451,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                ref: switchRef,
                                type: "button",
                                className: "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary/20 backdrop-blur-sm transition-colors duration-300 ease-spring focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 group",
                                role: "switch",
                                "aria-checked": billingInterval === 'yearly',
                                onClick: ()=>setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly'),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].span, {
                                        "aria-hidden": "true",
                                        className: "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-all duration-300",
                                        animate: isMounted ? {
                                            x: billingInterval === 'yearly' ? 20 : 0
                                        } : {},
                                        transition: {
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 15
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 462,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: billingInterval === 'monthly' ? 'Switch to yearly billing' : 'Switch to monthly billing'
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 474,
                                        columnNumber: 13
                                    }, this),
                                    isMounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                        children: billingInterval === 'yearly' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                            initial: {
                                                opacity: 0
                                            },
                                            animate: {
                                                opacity: 1
                                            },
                                            exit: {
                                                opacity: 0
                                            },
                                            className: "absolute right-0 top-0",
                                            children: [
                                                ...Array(5)
                                            ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                                    className: "absolute h-1 w-1 rounded-full bg-accent/50",
                                                    initial: {
                                                        x: 0,
                                                        y: 0,
                                                        opacity: 1,
                                                        scale: 0.5 + i * 0.1
                                                    },
                                                    animate: {
                                                        x: (i % 3 - 1) * 10,
                                                        y: (i % 3 - 1) * 10,
                                                        opacity: 0,
                                                        scale: 0
                                                    },
                                                    transition: {
                                                        duration: 0.4 + i * 0.1,
                                                        ease: "easeOut"
                                                    },
                                                    style: {
                                                        top: `${i * 20 + 10}%`,
                                                        right: `${i * 10 + 10}%`
                                                    }
                                                }, i, false, {
                                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                    lineNumber: 487,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                            lineNumber: 480,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 478,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                lineNumber: 454,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-sm flex items-center gap-1.5 ${billingInterval === 'yearly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`,
                                children: [
                                    "Yearly",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].span, {
                                        className: "inline-block px-1.5 py-0.5 text-xs rounded-full bg-accent/10 text-accent/90 font-medium backdrop-blur-sm",
                                        animate: isMounted ? {
                                            scale: billingInterval === 'yearly' ? [
                                                1,
                                                1.1,
                                                1
                                            ] : 1
                                        } : {},
                                        transition: {
                                            duration: 0.4,
                                            times: [
                                                0,
                                                0.5,
                                                1
                                            ],
                                            ease: "easeInOut"
                                        },
                                        children: "Save up to 16%"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 519,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                lineNumber: 517,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                        lineNumber: 444,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 429,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid md:grid-cols-3 gap-8 max-w-6xl mx-auto",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$config$2f$pricing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRICING_TIERS"].map((tier, index)=>{
                    const price = tier.pricing[billingInterval];
                    const isCurrentPlan = userTierId === tier.id;
                    // Determine button content and action based on authentication state
                    let buttonContent;
                    let buttonAction;
                    let buttonLink;
                    let buttonDisabled = false;
                    let buttonStyleClass = tier.popular ? 'bg-gradient-to-r from-primary/90 to-secondary/90 text-white hover:opacity-90' : 'glass-button bg-white/10 hover:bg-white/20 text-foreground';
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
                                buttonAction = ()=>handleSubscribe(price.priceId);
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
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MouseTrackCard, {
                        className: "h-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: isMounted ? {
                                opacity: 0,
                                y: 30
                            } : {
                                opacity: 1,
                                y: 0
                            },
                            whileInView: isMounted ? {
                                opacity: 1,
                                y: 0
                            } : {},
                            viewport: {
                                once: true
                            },
                            transition: {
                                duration: 0.6,
                                delay: 0.1 * (index + 1)
                            },
                            className: "h-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                className: `glass-card backdrop-blur-lg border relative overflow-hidden h-full flex flex-col
                  ${tier.popular ? 'border-primary/30 shadow-lg shadow-primary/10 dark:shadow-primary/20' : 'border-white/20 dark:border-white/10'}
                  hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all duration-300`,
                                children: [
                                    tier.popular && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-0 right-0 bg-gradient-to-r from-primary/90 to-secondary/90 text-white text-xs px-3 py-1 rounded-bl-lg flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 596,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Popular"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 597,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 595,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                className: `text-xl ${tier.popular ? "text-primary" : ""}`,
                                                children: tier.name
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 602,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                children: tier.description
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 603,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-4",
                                                children: [
                                                    price.amount ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-end",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].span, {
                                                                className: "text-3xl font-bold",
                                                                initial: isMounted ? {
                                                                    opacity: 0,
                                                                    y: -20
                                                                } : {
                                                                    opacity: 1,
                                                                    y: 0
                                                                },
                                                                animate: isMounted ? {
                                                                    opacity: 1,
                                                                    y: 0
                                                                } : {},
                                                                transition: {
                                                                    duration: 0.3
                                                                },
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatPrice"])(price.amount)
                                                            }, `${price.amount}-${billingInterval}`, false, {
                                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                                lineNumber: 607,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-muted-foreground ml-1 mb-1",
                                                                children: [
                                                                    "/",
                                                                    billingInterval === 'monthly' ? 'mo' : 'yr'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                                lineNumber: 616,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                        lineNumber: 606,
                                                        columnNumber: 25
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-3xl font-bold",
                                                        children: "Free"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                        lineNumber: 619,
                                                        columnNumber: 25
                                                    }, this),
                                                    isMounted && billingInterval === 'yearly' && tier.pricing.yearly.discount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                                                        className: "text-sm text-accent/90 mt-1",
                                                        initial: {
                                                            opacity: 0,
                                                            x: -10
                                                        },
                                                        animate: {
                                                            opacity: 1,
                                                            x: 0
                                                        },
                                                        transition: {
                                                            duration: 0.3,
                                                            delay: 0.1
                                                        },
                                                        children: [
                                                            "Save ",
                                                            tier.pricing.yearly.discount,
                                                            "% with annual billing"
                                                        ]
                                                    }, "yearly-discount", true, {
                                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                        lineNumber: 623,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 604,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 601,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "pb-0 flex-grow",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-2",
                                            children: tier.features.map((feature, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].li, {
                                                    className: "flex items-start gap-2",
                                                    initial: isMounted ? {
                                                        opacity: 0,
                                                        x: -10
                                                    } : {
                                                        opacity: 1,
                                                        x: 0
                                                    },
                                                    whileInView: isMounted ? {
                                                        opacity: 1,
                                                        x: 0
                                                    } : {},
                                                    viewport: {
                                                        once: true
                                                    },
                                                    transition: {
                                                        duration: 0.3,
                                                        delay: 0.05 * i
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                            className: "h-5 w-5 text-primary shrink-0 mt-0.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                            lineNumber: 647,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: feature
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                            lineNumber: 648,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                    lineNumber: 639,
                                                    columnNumber: 25
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                            lineNumber: 637,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 636,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardFooter"], {
                                        className: "pt-6 mt-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MagneticButton, {
                                            onClick: buttonAction,
                                            disabled: buttonDisabled,
                                            className: `w-full rounded-md py-2 px-4 font-medium ${buttonStyleClass}`,
                                            children: buttonLink ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: buttonLink,
                                                className: "flex items-center justify-center w-full h-full",
                                                children: buttonContent
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 661,
                                                columnNumber: 25
                                            }, this) : buttonContent
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                            lineNumber: 655,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 654,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                lineNumber: 590,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                            lineNumber: 583,
                            columnNumber: 15
                        }, this)
                    }, tier.id, false, {
                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                        lineNumber: 582,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 536,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
};
function LandingPage() {
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const { scrollYProgress } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useScroll"])();
    const heroOpacity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransform"])(scrollYProgress, [
        0,
        0.1
    ], [
        1,
        0.8
    ]);
    const heroY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransform"])(scrollYProgress, [
        0,
        0.1
    ], [
        0,
        -50
    ]);
    const progressBarScaleX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpring"])(scrollYProgress, {
        stiffness: 100,
        damping: 30
    });
    // State for user and subscription data
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [userTierId, setUserTierId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('free'); // Default to free
    // Fetch user and subscription data on client-side
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
        const checkAuthAndSubscription = async ()=>{
            const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
            const { data: { user } } = await supabase.auth.getUser();
            setIsAuthenticated(!!user);
            if (user) {
                // Fetch subscription if user is logged in
                const { data: subscription } = await supabase.from('subscriptions').select('*, prices(id, products(*))').eq('user_id', user.id).in('status', [
                    'trialing',
                    'active'
                ]).maybeSingle();
                if (subscription) {
                    const priceId = subscription.prices?.id;
                    const { tier } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$config$2f$pricing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTierByPriceId"])(priceId);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent z-50 origin-left",
                style: {
                    scaleX: progressBarScaleX
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 731,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AnimatedBackground, {}, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 738,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].section, {
                className: "relative py-24 md:py-36 z-10",
                style: mounted ? {
                    opacity: heroOpacity,
                    y: heroY
                } : {},
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "container mx-auto px-4 relative",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: "max-w-3xl mx-auto text-center",
                            initial: mounted ? {
                                opacity: 0,
                                y: 20
                            } : {
                                opacity: 1,
                                y: 0
                            },
                            animate: mounted ? {
                                opacity: 1,
                                y: 0
                            } : {},
                            transition: {
                                duration: 0.8
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: "inline-block mb-4 px-4 py-1.5 bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-full text-foreground/90 text-sm border border-white/20 shadow-lg",
                                    initial: mounted ? {
                                        opacity: 0,
                                        y: -20
                                    } : {
                                        opacity: 1,
                                        y: 0
                                    },
                                    animate: mounted ? {
                                        opacity: 1,
                                        y: 0
                                    } : {},
                                    transition: {
                                        delay: 0.1,
                                        duration: 0.6
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                className: "h-4 w-4 text-accent/80"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 759,
                                                columnNumber: 17
                                            }, this),
                                            "Powered by Pixio A100 GPUs"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 758,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 752,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: mounted ? {
                                        opacity: 0,
                                        y: 20
                                    } : {
                                        opacity: 1,
                                        y: 0
                                    },
                                    animate: mounted ? {
                                        opacity: 1,
                                        y: 0
                                    } : {},
                                    transition: {
                                        delay: 0.3,
                                        duration: 0.8
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            style: {
                                                backgroundImage: "linear-gradient(to right, #7068F4, #FF64B4, #ffac4c)",
                                                backgroundSize: "200% 200%",
                                                ...mounted ? {
                                                    animation: "gradientMove 15s ease infinite"
                                                } : {}
                                            },
                                            className: "jsx-2d184eea041bb039" + " " + "text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent",
                                            children: "Pixio API Starter"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                            lineNumber: 769,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            id: "2d184eea041bb039",
                                            children: "@keyframes gradientMove{0%{background-position:0%}50%{background-position:100%}to{background-position:0%}}"
                                        }, void 0, false, void 0, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 764,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                                    className: "text-lg sm:text-xl text-foreground/80 mb-8 leading-relaxed",
                                    initial: mounted ? {
                                        opacity: 0
                                    } : {
                                        opacity: 1
                                    },
                                    animate: mounted ? {
                                        opacity: 1
                                    } : {},
                                    transition: {
                                        delay: 0.5,
                                        duration: 0.8
                                    },
                                    children: "Unleash AI creativity with powerful machines for stunning image and video generation, powered by Supabase and a flexible credit system"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 791,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: "flex flex-col sm:flex-row gap-4 justify-center",
                                    initial: mounted ? {
                                        opacity: 0
                                    } : {
                                        opacity: 1
                                    },
                                    animate: mounted ? {
                                        opacity: 1
                                    } : {},
                                    transition: {
                                        delay: 0.7,
                                        duration: 0.8
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MagneticButton, {
                                            className: "bg-gradient-to-r from-primary/90 to-secondary/90 hover:from-primary/95 hover:to-secondary/95 text-white rounded-md py-2 px-4 font-medium shadow-md hover:shadow-lg transition-shadow",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "https://api.myapps.ai",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "flex items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                        lineNumber: 809,
                                                        columnNumber: 7
                                                    }, this),
                                                    "Visit Pixio API"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 808,
                                                columnNumber: 5
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                            lineNumber: 807,
                                            columnNumber: 3
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MagneticButton, {
                                            className: "glass-button bg-white/10 hover:bg-white/20 text-foreground rounded-md py-2 px-4 font-medium",
                                            onClick: ()=>{
                                                if (mounted) {
                                                    const pricingSection = document.getElementById('pricing');
                                                    if (pricingSection) {
                                                        pricingSection.scrollIntoView({
                                                            behavior: 'smooth'
                                                        });
                                                    }
                                                }
                                            },
                                            children: "View Plans"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                            lineNumber: 814,
                                            columnNumber: 3
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MagneticButton, {
                                            className: "glass-button bg-white/10 hover:bg-white/20 text-foreground rounded-md py-2 px-4 font-medium",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "https://github.com/afarhadi99/pixio-api-starter",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "flex items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$github$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Github$3e$__["Github"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                        lineNumber: 830,
                                                        columnNumber: 7
                                                    }, this),
                                                    "Fork Repo"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 829,
                                                columnNumber: 5
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                            lineNumber: 828,
                                            columnNumber: 3
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 801,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                            lineNumber: 746,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                        lineNumber: 745,
                        columnNumber: 9
                    }, this),
                    mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: "absolute bottom-8 left-1/2 transform -translate-x-1/2",
                        animate: {
                            y: [
                                0,
                                10,
                                0
                            ]
                        },
                        transition: {
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "loop"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].svg, {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "24",
                            height: "24",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            className: "text-primary/70",
                            whileHover: {
                                scale: 1.2
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M12 5v14M5 12l7 7 7-7"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                lineNumber: 864,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                            lineNumber: 851,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                        lineNumber: 840,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 741,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-20 z-10 relative",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-12",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GradientHeading, {
                                className: "mx-auto justify-center",
                                children: "Powerful AI Generation Features"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                lineNumber: 874,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                            lineNumber: 873,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid md:grid-cols-3 gap-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MouseTrackCard, {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        className: "glass-card rounded-xl p-6 backdrop-blur-lg border border-white/20 dark:border-white/10 h-full",
                                        initial: mounted ? {
                                            opacity: 0,
                                            y: 30
                                        } : {
                                            opacity: 1,
                                            y: 0
                                        },
                                        whileInView: mounted ? {
                                            opacity: 1,
                                            y: 0
                                        } : {},
                                        viewport: {
                                            once: true
                                        },
                                        transition: {
                                            duration: 0.6,
                                            delay: 0.1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    className: "h-6 w-6 text-primary",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                        lineNumber: 891,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                    lineNumber: 890,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 889,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-semibold mb-2 text-primary",
                                                children: "Image Generation"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 894,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-foreground/80",
                                                children: "Create stunning images using advanced AI machines powered by the Pixio API. Turn text prompts into visual art."
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 895,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 882,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 881,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MouseTrackCard, {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        className: "glass-card rounded-xl p-6 backdrop-blur-lg border border-white/20 dark:border-white/10 h-full",
                                        initial: mounted ? {
                                            opacity: 0,
                                            y: 30
                                        } : {
                                            opacity: 1,
                                            y: 0
                                        },
                                        whileInView: mounted ? {
                                            opacity: 1,
                                            y: 0
                                        } : {},
                                        viewport: {
                                            once: true
                                        },
                                        transition: {
                                            duration: 0.6,
                                            delay: 0.2
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-12 h-12 bg-secondary/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    className: "h-6 w-6 text-secondary",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                        lineNumber: 912,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                    lineNumber: 911,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 910,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-semibold mb-2 text-secondary",
                                                children: "Video Generation"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 915,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-foreground/80",
                                                children: "Transform concepts into mesmerizing videos. Our API harnesses the power of cutting-edge AI for fluid animations."
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 916,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 903,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 902,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MouseTrackCard, {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        className: "glass-card rounded-xl p-6 backdrop-blur-lg border border-white/20 dark:border-white/10 h-full",
                                        initial: mounted ? {
                                            opacity: 0,
                                            y: 30
                                        } : {
                                            opacity: 1,
                                            y: 0
                                        },
                                        whileInView: mounted ? {
                                            opacity: 1,
                                            y: 0
                                        } : {},
                                        viewport: {
                                            once: true
                                        },
                                        transition: {
                                            duration: 0.6,
                                            delay: 0.3
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-12 h-12 bg-accent/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    className: "h-6 w-6 text-accent/90",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                        lineNumber: 933,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                    lineNumber: 932,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 931,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-semibold mb-2 text-accent/90",
                                                children: "Credit System"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 936,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-foreground/80",
                                                children: "Flexible credit-based system with pay-as-you-go options. Use credits for different generation types based on your needs."
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 937,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 924,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 923,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                            lineNumber: 879,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                    lineNumber: 872,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 871,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-20 z-10 relative",
                id: "workflows",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-12",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GradientHeading, {
                                    className: "mx-auto justify-center",
                                    from: "from-secondary",
                                    to: "to-primary",
                                    children: "Pixio API Models"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 950,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                                    className: "text-center text-foreground/80 mt-6 mb-12 max-w-3xl mx-auto",
                                    initial: mounted ? {
                                        opacity: 0
                                    } : {
                                        opacity: 1
                                    },
                                    whileInView: mounted ? {
                                        opacity: 1
                                    } : {},
                                    viewport: {
                                        once: true
                                    },
                                    transition: {
                                        duration: 0.6,
                                        delay: 0.2
                                    },
                                    children: "Powerful AI models integrated into your application for image generation, editing, and video creation"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 954,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                            lineNumber: 949,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid md:grid-cols-3 gap-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkflowCard, {
                                    title: "Krea Flux",
                                    description: "High-quality image generation with the Flux model. Perfect for fashion, portraits, and detailed imagery. Create stunning visuals from text prompts.",
                                    link: "https://api.myapps.ai/share/workflow/user_2avNabxB8PQU2qdh6dkcHx6J7AI/krea",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5 text-primary",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                            lineNumber: 971,
                                            columnNumber: 17
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 970,
                                        columnNumber: 21
                                    }, void 0),
                                    index: 1
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 966,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkflowCard, {
                                    title: "Qwen Edit",
                                    description: "AI-powered image editing with multiple image inputs and positive/negative prompting. Transform and enhance your images with intelligent edits.",
                                    link: "https://api.myapps.ai/share/workflow/user_34PT7Nq6CR0OkBRluLtZZAPYUWy/qwen-edit-clone",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5 text-accent",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                            lineNumber: 981,
                                            columnNumber: 17
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 980,
                                        columnNumber: 21
                                    }, void 0),
                                    index: 2
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 976,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkflowCard, {
                                    title: "Wan 2.2 First/Last Frame",
                                    description: "Generate smooth video transitions between two keyframe images. Create cinematic animations from start and end images with AI-powered interpolation.",
                                    link: "https://api.myapps.ai/share/workflow/user_34PT7Nq6CR0OkBRluLtZZAPYUWy/wan22-first-last-frame",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5 text-secondary",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                            lineNumber: 991,
                                            columnNumber: 17
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 990,
                                        columnNumber: 21
                                    }, void 0),
                                    index: 3
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 986,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                            lineNumber: 965,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                    lineNumber: 948,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 947,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-20 z-10 relative",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-12",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GradientHeading, {
                                className: "mx-auto justify-center",
                                from: "from-accent/90",
                                via: "via-primary",
                                to: "to-secondary",
                                children: "How Pixio API Works"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                lineNumber: 1003,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                            lineNumber: 1002,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid md:grid-cols-3 gap-8 relative",
                            children: [
                                mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden md:block absolute top-16 left-[20%] right-[20%] h-1 overflow-hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        className: "absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent",
                                        animate: {
                                            x: [
                                                "-100%",
                                                "100%"
                                            ]
                                        },
                                        transition: {
                                            duration: 5,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 1012,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 1011,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MouseTrackCard, {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        className: "relative glass-card p-6 text-center backdrop-blur-lg border border-white/20 dark:border-white/10 h-full",
                                        initial: mounted ? {
                                            opacity: 0,
                                            y: 30
                                        } : {
                                            opacity: 1,
                                            y: 0
                                        },
                                        whileInView: mounted ? {
                                            opacity: 1,
                                            y: 0
                                        } : {},
                                        viewport: {
                                            once: true
                                        },
                                        transition: {
                                            duration: 0.6,
                                            delay: 0.1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-gradient-to-r from-primary to-secondary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative",
                                                children: mounted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].span, {
                                                    animate: {
                                                        scale: [
                                                            1,
                                                            1.1,
                                                            1
                                                        ]
                                                    },
                                                    transition: {
                                                        duration: 2,
                                                        repeat: Infinity
                                                    },
                                                    children: "1"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                    lineNumber: 1037,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "1"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                    lineNumber: 1044,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 1035,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-semibold mb-2",
                                                children: "Choose Your Type"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 1047,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-foreground/80",
                                                children: "Select between image or video generation in the intuitive dashboard interface."
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 1048,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 1028,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 1027,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MouseTrackCard, {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        className: "relative glass-card p-6 text-center backdrop-blur-lg border border-white/20 dark:border-white/10 h-full",
                                        initial: mounted ? {
                                            opacity: 0,
                                            y: 30
                                        } : {
                                            opacity: 1,
                                            y: 0
                                        },
                                        whileInView: mounted ? {
                                            opacity: 1,
                                            y: 0
                                        } : {},
                                        viewport: {
                                            once: true
                                        },
                                        transition: {
                                            duration: 0.6,
                                            delay: 0.2
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-gradient-to-r from-secondary to-accent/80 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative",
                                                children: mounted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].span, {
                                                    animate: {
                                                        scale: [
                                                            1,
                                                            1.1,
                                                            1
                                                        ]
                                                    },
                                                    transition: {
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: 0.6
                                                    },
                                                    children: "2"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                    lineNumber: 1065,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "2"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                    lineNumber: 1072,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 1063,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-semibold mb-2",
                                                children: "Create Your Prompt"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 1075,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-foreground/80",
                                                children: "Write detailed prompts to guide the AI in generating your desired output."
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 1076,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 1056,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 1055,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MouseTrackCard, {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        className: "relative glass-card p-6 text-center backdrop-blur-lg border border-white/20 dark:border-white/10 h-full",
                                        initial: mounted ? {
                                            opacity: 0,
                                            y: 30
                                        } : {
                                            opacity: 1,
                                            y: 0
                                        },
                                        whileInView: mounted ? {
                                            opacity: 1,
                                            y: 0
                                        } : {},
                                        viewport: {
                                            once: true
                                        },
                                        transition: {
                                            duration: 0.6,
                                            delay: 0.3
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-gradient-to-r from-accent/80 to-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative",
                                                children: mounted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].span, {
                                                    animate: {
                                                        scale: [
                                                            1,
                                                            1.1,
                                                            1
                                                        ]
                                                    },
                                                    transition: {
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: 1.2
                                                    },
                                                    children: "3"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                    lineNumber: 1093,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "3"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                    lineNumber: 1100,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 1091,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-semibold mb-2",
                                                children: "Generate & Download"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 1103,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-foreground/80",
                                                children: "Use your credits to generate the media and download your creations instantly."
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                lineNumber: 1104,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 1084,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 1083,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                            lineNumber: 1008,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                    lineNumber: 1001,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 1000,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-20 z-10 relative",
                id: "pricing",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PricingSection, {
                        userTierId: userTierId,
                        isAuthenticated: isAuthenticated
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                        lineNumber: 1116,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                    lineNumber: 1115,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 1114,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].section, {
                className: "py-20 z-10 relative",
                initial: mounted ? {
                    opacity: 0
                } : {
                    opacity: 1
                },
                whileInView: mounted ? {
                    opacity: 1
                } : {},
                viewport: {
                    once: true
                },
                transition: {
                    duration: 0.8
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-12",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GradientHeading, {
                                className: "mx-auto justify-center",
                                from: "from-primary",
                                via: "via-secondary",
                                to: "to-accent",
                                children: "Built With Modern Tech"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                lineNumber: 1130,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                            lineNumber: 1129,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                            className: "text-center text-foreground/80 mb-12 max-w-3xl mx-auto",
                            initial: mounted ? {
                                opacity: 0
                            } : {
                                opacity: 1
                            },
                            whileInView: mounted ? {
                                opacity: 1
                            } : {},
                            viewport: {
                                once: true
                            },
                            transition: {
                                duration: 0.6,
                                delay: 0.2
                            },
                            children: "A powerful stack of technologies to provide a seamless experience"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                            lineNumber: 1135,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 md:grid-cols-4 gap-6",
                            children: [
                                {
                                    name: "Next.js 15",
                                    icon: "/icons/nextjs.svg",
                                    color: "from-primary to-secondary"
                                },
                                {
                                    name: "Supabase",
                                    icon: "/icons/supabase.svg",
                                    color: "from-accent/80 to-secondary"
                                },
                                {
                                    name: "Stripe",
                                    icon: "/icons/stripe.svg",
                                    color: "from-primary to-accent/80"
                                },
                                {
                                    name: "ComfyUI",
                                    icon: "/icons/comfyui.svg",
                                    color: "from-secondary to-primary"
                                },
                                {
                                    name: "Tailwind CSS",
                                    icon: "/icons/tailwind.svg",
                                    color: "from-accent/80 to-primary"
                                },
                                {
                                    name: "TypeScript",
                                    icon: "/icons/typescript.svg",
                                    color: "from-secondary to-accent/80"
                                },
                                {
                                    name: "Pixio API",
                                    icon: "/icons/pixio.svg",
                                    color: "from-primary to-secondary"
                                },
                                {
                                    name: "ShadcnUI",
                                    icon: "/icons/shadcn.svg",
                                    color: "from-accent/80 to-primary"
                                }
                            ].map((tech, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MouseTrackCard, {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        className: "glass-card p-4 text-center backdrop-blur-lg border border-white/20 dark:border-white/10 h-full",
                                        initial: mounted ? {
                                            opacity: 0,
                                            y: 20
                                        } : {
                                            opacity: 1,
                                            y: 0
                                        },
                                        whileInView: mounted ? {
                                            opacity: 1,
                                            y: 0
                                        } : {},
                                        viewport: {
                                            once: true
                                        },
                                        transition: {
                                            duration: 0.4,
                                            delay: 0.1 * index
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-12 flex items-center justify-center mb-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `w-10 h-10 bg-gradient-to-br ${tech.color} rounded-md flex items-center justify-center text-white bg-opacity-90`,
                                                        children: tech.name[0]
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                        lineNumber: 1166,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                    lineNumber: 1165,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-medium",
                                                    children: tech.name
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                    lineNumber: 1172,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                            lineNumber: 1164,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 1157,
                                        columnNumber: 17
                                    }, this)
                                }, tech.name, false, {
                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                    lineNumber: 1156,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                            lineNumber: 1145,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                    lineNumber: 1128,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 1121,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].section, {
                className: "py-20 z-10 relative",
                initial: mounted ? {
                    opacity: 0,
                    y: 30
                } : {
                    opacity: 1,
                    y: 0
                },
                whileInView: mounted ? {
                    opacity: 1,
                    y: 0
                } : {},
                viewport: {
                    once: true
                },
                transition: {
                    duration: 0.8
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: "glass-card p-8 max-w-4xl mx-auto border border-white/20 dark:border-white/10 backdrop-blur-lg relative overflow-hidden rounded-xl",
                        initial: mounted ? {
                            opacity: 0,
                            scale: 0.95
                        } : {
                            opacity: 1,
                            scale: 1
                        },
                        whileInView: mounted ? {
                            opacity: 1,
                            scale: 1
                        } : {},
                        viewport: {
                            once: true
                        },
                        transition: {
                            duration: 0.6
                        },
                        children: [
                            mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse opacity-70"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 1200,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse opacity-70",
                                        style: {
                                            animationDelay: '1s'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 1201,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: "relative z-10",
                                initial: mounted ? {
                                    opacity: 0,
                                    y: 20
                                } : {
                                    opacity: 1,
                                    y: 0
                                },
                                whileInView: mounted ? {
                                    opacity: 1,
                                    y: 0
                                } : {},
                                viewport: {
                                    once: true
                                },
                                transition: {
                                    duration: 0.8,
                                    delay: 0.2
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/10 backdrop-blur-xl w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                            className: "h-8 w-8 text-primary"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                            lineNumber: 1213,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 1212,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary",
                                        children: "Ready to Create with AI?"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 1216,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-lg text-foreground/80 mb-8 max-w-2xl mx-auto",
                                        children: "Start generating stunning images and videos today with our powerful AI machines and the Pixio API."
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 1220,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MagneticButton, {
                                        className: "bg-gradient-to-r from-primary/90 to-secondary/90 text-white hover:opacity-90 hover:shadow-lg transition-all shadow-md rounded-md py-2 px-6 font-medium",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: isAuthenticated ? "/dashboard" : "/signup",
                                            className: "flex items-center",
                                            children: [
                                                isAuthenticated ? "Go to Dashboard" : "Get Started",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                    className: "ml-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                                    lineNumber: 1226,
                                                    columnNumber: 73
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                            lineNumber: 1225,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                        lineNumber: 1224,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                                lineNumber: 1205,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                        lineNumber: 1190,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                    lineNumber: 1189,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(marketing)/page.tsx",
                lineNumber: 1182,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}}),

};

//# sourceMappingURL=apps_web_src_1e6be5f5._.js.map