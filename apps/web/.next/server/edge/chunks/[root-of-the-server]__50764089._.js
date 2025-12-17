(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__50764089._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/packages/supabase/src/lib/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/supabase/middleware.ts
__turbopack_context__.s({
    "updateSession": (()=>updateSession)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
;
;
async function updateSession(request) {
    const supabaseUrl = ("TURBOPACK compile-time value", "https://eskcmosgdvrkultpuljo.supabase.co");
    const supabaseKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVza2Ntb3NnZHZya3VsdHB1bGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NDQ5MzIsImV4cCI6MjA4MTQyMDkzMn0.WI3zZ7w6XOPA_cxzemInP0EIaQADMbj5kzpFXJtHZGQ");
    console.log("[Middleware] Checking Env:", {
        url: ("TURBOPACK compile-time truthy", 1) ? supabaseUrl.substring(0, 10) + '...' : ("TURBOPACK unreachable", undefined),
        key: ("TURBOPACK compile-time truthy", 1) ? "PRESENT" : ("TURBOPACK unreachable", undefined)
    });
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    let supabaseResponse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request
    });
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createServerClient"])(supabaseUrl, supabaseKey, {
        cookies: {
            getAll () {
                return request.cookies.getAll();
            },
            setAll (cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options })=>{
                    supabaseResponse.cookies.set(name, value, options);
                });
            }
        }
    });
    try {
        // Refresh session
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.log("[Middleware] getUser error:", error.message);
        }
        // Optional: Redirect unauthenticated users
        const authPath = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup') || request.nextUrl.pathname.startsWith('/auth');
        const protectedPaths = [
            '/dashboard',
            '/account',
            '/premium'
        ];
        const isProtectedPath = protectedPaths.some((path)=>request.nextUrl.pathname.startsWith(path));
        // Redirect unauthenticated users from protected routes to login
        if (!user && isProtectedPath) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/login';
            redirectUrl.searchParams.set('from', request.nextUrl.pathname);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
        }
        // Redirect authenticated users from auth routes to dashboard
        if (user && authPath) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/dashboard';
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
        }
    } catch (err) {
        console.error("[Middleware] Unexpected error fetching user:", err);
    }
    return supabaseResponse;
}
}}),
"[project]/apps/web/src/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/middleware.ts
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/supabase/src/lib/middleware.ts [middleware-edge] (ecmascript)");
;
async function middleware(request) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$supabase$2f$src$2f$lib$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["updateSession"])(request);
}
const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)'
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__50764089._.js.map