(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__9ae05967._.js", {

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
"[project]/apps/web/src/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/middleware.ts
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
(()=>{
    const e = new Error("Cannot find module '@/lib/supabase/middleware'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
async function middleware(request) {
    return await updateSession(request);
}
const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)'
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__9ae05967._.js.map