(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/apps/web/src/lib/validators/auth.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/lib/validators/auth.ts
__turbopack_context__.s({
    "loginSchema": (()=>loginSchema),
    "signupSchema": (()=>signupSchema),
    "updateProfileSchema": (()=>updateProfileSchema)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/lib/index.mjs [app-client] (ecmascript)");
;
const loginSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().email({
        message: 'Please enter a valid email address'
    }),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().min(1, {
        message: 'Password is required'
    })
});
const signupSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().email({
        message: 'Please enter a valid email address'
    }),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().min(8, {
        message: 'Password must be at least 8 characters'
    }),
    full_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().min(1, {
        message: 'Name is required'
    }).optional()
});
const updateProfileSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
    full_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().min(1, {
        message: 'Name is required'
    }),
    avatar_url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().optional()
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/apps/web/src/lib/actions/data:bceb77 [app-client] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"40f7f6cafd083d58d8432e7822c72a041710641dc1":"updateProfile"},"apps/web/src/lib/actions/auth.actions.ts",""] */ __turbopack_context__.s({
    "updateProfile": (()=>updateProfile)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var updateProfile = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40f7f6cafd083d58d8432e7822c72a041710641dc1", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "updateProfile"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYXV0aC5hY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNyYy9saWIvYWN0aW9ucy9hdXRoLmFjdGlvbnMudHNcclxuJ3VzZSBzZXJ2ZXInO1xyXG5cclxuaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHJlcG8vc3VwYWJhc2Uvc2VydmVyJztcclxuaW1wb3J0IHsgcmVkaXJlY3QgfSBmcm9tICduZXh0L25hdmlnYXRpb24nO1xyXG5pbXBvcnQgeyBjb29raWVzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJztcclxuaW1wb3J0IHsgbG9naW5TY2hlbWEsIHNpZ251cFNjaGVtYSwgVExvZ2luU2NoZW1hLCBUU2lnbnVwU2NoZW1hLCB1cGRhdGVQcm9maWxlU2NoZW1hLCBUVXBkYXRlUHJvZmlsZVNjaGVtYSB9IGZyb20gJ0AvbGliL3ZhbGlkYXRvcnMvYXV0aCc7XHJcbmltcG9ydCB7IGluaXRpYWxpemVVc2VyQ3JlZGl0cyB9IGZyb20gJ0AvbGliL2NyZWRpdHMnO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ2luKHZhbHVlczogVExvZ2luU2NoZW1hKSB7XHJcbiAgLy8gVmFsaWRhdGUgaW5wdXRcclxuICBjb25zdCB2YWxpZGF0ZWRGaWVsZHMgPSBsb2dpblNjaGVtYS5zYWZlUGFyc2UodmFsdWVzKTtcclxuICBpZiAoIXZhbGlkYXRlZEZpZWxkcy5zdWNjZXNzKSB7XHJcbiAgICByZXR1cm4geyBlcnJvcjogJ0ludmFsaWQgaW5wdXQnIH07XHJcbiAgfVxyXG5cclxuICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCB9ID0gdmFsaWRhdGVkRmllbGRzLmRhdGE7XHJcbiAgXHJcbiAgLy8gQ2FsbCBjb29raWVzIHRvIHByZXZlbnQgY2FjaGluZ1xyXG4gIGNvb2tpZXMoKTtcclxuXHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcclxuICBcclxuICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLnNpZ25JbldpdGhQYXNzd29yZCh7XHJcbiAgICBlbWFpbCxcclxuICAgIHBhc3N3b3JkLFxyXG4gIH0pO1xyXG4gIFxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgcmV0dXJuIHsgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfTtcclxuICB9XHJcbiAgXHJcbiAgcmVkaXJlY3QoJy9kYXNoYm9hcmQnKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ251cCh2YWx1ZXM6IFRTaWdudXBTY2hlbWEpIHtcclxuICAvLyBWYWxpZGF0ZSBpbnB1dFxyXG4gIGNvbnN0IHZhbGlkYXRlZEZpZWxkcyA9IHNpZ251cFNjaGVtYS5zYWZlUGFyc2UodmFsdWVzKTtcclxuICBpZiAoIXZhbGlkYXRlZEZpZWxkcy5zdWNjZXNzKSB7XHJcbiAgICByZXR1cm4geyBlcnJvcjogJ0ludmFsaWQgaW5wdXQnIH07XHJcbiAgfVxyXG5cclxuICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCwgZnVsbF9uYW1lIH0gPSB2YWxpZGF0ZWRGaWVsZHMuZGF0YTtcclxuICBcclxuICAvLyBDYWxsIGNvb2tpZXMgdG8gcHJldmVudCBjYWNoaW5nXHJcbiAgY29va2llcygpO1xyXG5cclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xyXG4gIFxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguc2lnblVwKHtcclxuICAgIGVtYWlsLFxyXG4gICAgcGFzc3dvcmQsXHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICAgIGVtYWlsUmVkaXJlY3RUbzogYCR7cHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU0lURV9VUkx9L2F1dGgvY2FsbGJhY2tgLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgZnVsbF9uYW1lLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9KTtcclxuICBcclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHJldHVybiB7IGVycm9yOiBlcnJvci5tZXNzYWdlIH07XHJcbiAgfVxyXG4gIFxyXG4gIC8vIEluaXRpYWxpemUgY3JlZGl0cyBmb3IgdGhlIG5ldyB1c2VyXHJcbiAgaWYgKGRhdGEudXNlcikge1xyXG4gICAgYXdhaXQgaW5pdGlhbGl6ZVVzZXJDcmVkaXRzKGRhdGEudXNlci5pZCk7XHJcbiAgfVxyXG4gIFxyXG4gIC8vIENoZWNrIGlmIGVtYWlsIGNvbmZpcm1hdGlvbiBpcyByZXF1aXJlZFxyXG4gIC8vIFJlZGlyZWN0IHRvIGEgY29uZmlybWF0aW9uIHBhZ2UgaWYgbmVlZGVkXHJcbiAgXHJcbiAgcmVkaXJlY3QoJy9kYXNoYm9hcmQnKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ291dCgpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xyXG4gIGF3YWl0IHN1cGFiYXNlLmF1dGguc2lnbk91dCgpO1xyXG4gIHJlZGlyZWN0KCcvJyk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVQcm9maWxlKHZhbHVlczogVFVwZGF0ZVByb2ZpbGVTY2hlbWEpIHtcclxuICAvLyBWYWxpZGF0ZSBpbnB1dFxyXG4gIGNvbnN0IHZhbGlkYXRlZEZpZWxkcyA9IHVwZGF0ZVByb2ZpbGVTY2hlbWEuc2FmZVBhcnNlKHZhbHVlcyk7XHJcbiAgaWYgKCF2YWxpZGF0ZWRGaWVsZHMuc3VjY2Vzcykge1xyXG4gICAgcmV0dXJuIHsgZXJyb3I6ICdJbnZhbGlkIGlucHV0JyB9O1xyXG4gIH1cclxuXHJcbiAgY29uc3QgeyBmdWxsX25hbWUsIGF2YXRhcl91cmwgfSA9IHZhbGlkYXRlZEZpZWxkcy5kYXRhO1xyXG4gIFxyXG4gIC8vIENhbGwgY29va2llcyB0byBwcmV2ZW50IGNhY2hpbmdcclxuICBjb29raWVzKCk7XHJcblxyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XHJcbiAgXHJcbiAgY29uc3QgeyBkYXRhOiB7IHVzZXIgfSwgZXJyb3I6IHVzZXJFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKCk7XHJcbiAgXHJcbiAgaWYgKHVzZXJFcnJvciB8fCAhdXNlcikge1xyXG4gICAgcmV0dXJuIHsgZXJyb3I6ICdBdXRoZW50aWNhdGlvbiBlcnJvcicgfTtcclxuICB9XHJcbiAgXHJcbiAgLy8gVXBkYXRlIHVzZXIgbWV0YWRhdGFcclxuICBjb25zdCB7IGVycm9yOiB1cGRhdGVBdXRoRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGgudXBkYXRlVXNlcih7XHJcbiAgICBkYXRhOiB7IGZ1bGxfbmFtZSwgYXZhdGFyX3VybCB9LFxyXG4gIH0pO1xyXG4gIFxyXG4gIGlmICh1cGRhdGVBdXRoRXJyb3IpIHtcclxuICAgIHJldHVybiB7IGVycm9yOiB1cGRhdGVBdXRoRXJyb3IubWVzc2FnZSB9O1xyXG4gIH1cclxuICBcclxuICAvLyBVcGRhdGUgcHVibGljIHByb2ZpbGVcclxuICBjb25zdCB7IGVycm9yOiB1cGRhdGVQcm9maWxlRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbSgndXNlcnMnKVxyXG4gICAgLnVwZGF0ZSh7XHJcbiAgICAgIGZ1bGxfbmFtZSxcclxuICAgICAgYXZhdGFyX3VybCxcclxuICAgIH0pXHJcbiAgICAuZXEoJ2lkJywgdXNlci5pZCk7XHJcbiAgXHJcbiAgaWYgKHVwZGF0ZVByb2ZpbGVFcnJvcikge1xyXG4gICAgcmV0dXJuIHsgZXJyb3I6IHVwZGF0ZVByb2ZpbGVFcnJvci5tZXNzYWdlIH07XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IitTQWlGc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/apps/web/src/components/account/update-profile-form.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/components/account/update-profile-form.tsx
__turbopack_context__.s({
    "UpdateProfileForm": (()=>UpdateProfileForm)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/index.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@hookform/resolvers/zod/dist/zod.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$validators$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/validators/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$data$3a$bceb77__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/actions/data:bceb77 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)"); // Import motion
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/index.ts [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/ui/form.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/ui/input.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
function UpdateProfileForm({ profile }) {
    _s();
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const form = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodResolver"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$validators$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfileSchema"]),
        defaultValues: {
            full_name: profile?.full_name || '',
            avatar_url: profile?.avatar_url || ''
        }
    });
    async function onSubmit(values) {
        setIsLoading(true);
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$actions$2f$data$3a$bceb77__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["updateProfile"])(values);
            if (result?.error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(result.error);
            } else if (result?.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Profile updated successfully');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message || 'Something went wrong');
        } finally{
            setIsLoading(false);
        }
    }
    // Define form fields with animation delays
    const formFields = [
        {
            name: "full_name",
            label: "Name",
            placeholder: "Your Name",
            type: "text",
            delay: 0
        },
        {
            name: "avatar_url",
            label: "Avatar URL",
            placeholder: "https://example.com/avatar.jpg",
            type: "text",
            delay: 0.1
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Form"], {
        ...form,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: form.handleSubmit(onSubmit),
            className: "space-y-5",
            children: [
                " ",
                formFields.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 10
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.4,
                            delay: field.delay
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormField"], {
                            control: form.control,
                            name: field.name,
                            render: ({ field: formField })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormItem"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormLabel"], {
                                            className: "text-base font-medium text-foreground/90",
                                            children: field.label
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/account/update-profile-form.tsx",
                                            lineNumber: 79,
                                            columnNumber: 19
                                        }, void 0),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormControl"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                placeholder: field.placeholder,
                                                ...formField,
                                                type: field.type,
                                                className: "glass-input bg-white/5 border-white/15 focus:border-primary/60 focus:ring-primary/30 focus:ring-2 transition-all text-base p-3 rounded-lg" // Enhanced style
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/account/update-profile-form.tsx",
                                                lineNumber: 82,
                                                columnNumber: 21
                                            }, void 0)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/account/update-profile-form.tsx",
                                            lineNumber: 80,
                                            columnNumber: 19
                                        }, void 0),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormMessage"], {}, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/account/update-profile-form.tsx",
                                            lineNumber: 89,
                                            columnNumber: 19
                                        }, void 0)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/account/update-profile-form.tsx",
                                    lineNumber: 77,
                                    columnNumber: 17
                                }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/account/update-profile-form.tsx",
                            lineNumber: 73,
                            columnNumber: 13
                        }, this)
                    }, field.name, false, {
                        fileName: "[project]/apps/web/src/components/account/update-profile-form.tsx",
                        lineNumber: 67,
                        columnNumber: 12
                    }, this)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 10
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        duration: 0.4,
                        delay: 0.2
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        type: "submit",
                        disabled: isLoading,
                        className: "glass-button bg-gradient-to-r from-primary to-secondary text-white hover:opacity-95 hover:shadow-lg transition-all duration-300 shadow-md text-lg py-3 font-semibold" // Styled button
                        ,
                        children: isLoading ? 'Saving...' : 'Save Changes'
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/account/update-profile-form.tsx",
                        lineNumber: 102,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/account/update-profile-form.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/account/update-profile-form.tsx",
            lineNumber: 65,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/account/update-profile-form.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
_s(UpdateProfileForm, "+pZDbQQAleFIga/1HtLeBlDo8HI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"]
    ];
});
_c = UpdateProfileForm;
var _c;
__turbopack_context__.k.register(_c, "UpdateProfileForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/apps/web/src/components/account/success-toast.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/components/account/success-toast.tsx
__turbopack_context__.s({
    "SuccessToast": (()=>SuccessToast),
    "SuccessToastWrapper": (()=>SuccessToastWrapper)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
function SuccessToast() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const success = searchParams.get('success') === 'true';
    const creditSuccess = searchParams.get('credit_success') === 'true';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SuccessToast.useEffect": ()=>{
            if (success) {
                // Show subscription success toast
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-medium",
                            children: "Payment successful!"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/account/success-toast.tsx",
                            lineNumber: 19,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm",
                            children: "Your subscription is now active."
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/account/success-toast.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/account/success-toast.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this), {
                    duration: 5000
                });
                // Clean up URL parameters
                setTimeout({
                    "SuccessToast.useEffect": ()=>{
                        router.replace('/account');
                    }
                }["SuccessToast.useEffect"], 500);
            } else if (creditSuccess) {
                // Show credit purchase success toast
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-medium",
                            children: "Credits purchased!"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/account/success-toast.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm",
                            children: "Your credits have been added to your account."
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/account/success-toast.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/account/success-toast.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, this), {
                    duration: 5000
                });
                // Clean up URL parameters
                setTimeout({
                    "SuccessToast.useEffect": ()=>{
                        router.replace('/account');
                    }
                }["SuccessToast.useEffect"], 500);
            }
        }
    }["SuccessToast.useEffect"], [
        router,
        success,
        creditSuccess
    ]);
    return null;
}
_s(SuccessToast, "8i1PHtDhDf9NMpKTkROQKKwA/RI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = SuccessToast;
function SuccessToastWrapper() {
    _s1();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const success = searchParams.get('success') === 'true';
    const creditSuccess = searchParams.get('credit_success') === 'true';
    if (success || creditSuccess) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SuccessToast, {}, void 0, false, {
            fileName: "[project]/apps/web/src/components/account/success-toast.tsx",
            lineNumber: 60,
            columnNumber: 12
        }, this);
    }
    return null;
}
_s1(SuccessToastWrapper, "a+DZx9DY26Zf8FVy1bxe3vp9l1w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c1 = SuccessToastWrapper;
var _c, _c1;
__turbopack_context__.k.register(_c, "SuccessToast");
__turbopack_context__.k.register(_c1, "SuccessToastWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/apps/web/src/components/account/manage-subscription-button.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/components/account/manage-subscription-button.tsx
__turbopack_context__.s({
    "ManageSubscriptionButton": (()=>ManageSubscriptionButton)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/index.ts [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>"); // Added icon
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function ManageSubscriptionButton() {
    _s();
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleManageSubscription = async ()=>{
        setIsLoading(true);
        try {
            const response = await fetch('/api/create-customer-portal', {
                method: 'POST'
            });
            const data = await response.json();
            if (response.ok && data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create customer portal session');
            }
        } catch (error) {
            console.error('Error:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message || 'Something went wrong');
            setIsLoading(false);
        }
    };
    return(// Styled Button with icon
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        onClick: handleManageSubscription,
        className: "w-full glass-button bg-white/10 hover:bg-white/20 text-foreground hover:text-primary transition-all duration-300 shadow-md text-base py-2.5 font-semibold" // Styled button
        ,
        disabled: isLoading,
        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "mr-2 h-4 w-4 animate-spin"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/account/manage-subscription-button.tsx",
                    lineNumber: 43,
                    columnNumber: 12
                }, this),
                " Loading..."
            ]
        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                    className: "mr-2 h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/account/manage-subscription-button.tsx",
                    lineNumber: 47,
                    columnNumber: 12
                }, this),
                " Manage Subscription"
            ]
        }, void 0, true)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/account/manage-subscription-button.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this));
}
_s(ManageSubscriptionButton, "EmvgwIb3cHpoFpeP+WmEDbjx4y4=");
_c = ManageSubscriptionButton;
var _c;
__turbopack_context__.k.register(_c, "ManageSubscriptionButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/apps/web/src/components/account/credit-pack-card.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/components/account/credit-pack-card.tsx
__turbopack_context__.s({
    "CreditPackCard": (()=>CreditPackCard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/index.ts [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)"); // Import motion
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>"); // Added icon
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function CreditPackCard({ creditPack }) {
    _s();
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handlePurchase = async ()=>{
        setIsLoading(true);
        try {
            const response = await fetch('/api/purchase-credits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    priceId: creditPack.priceId
                })
            });
            const data = await response.json();
            if (response.ok && data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error('Error:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message || 'Something went wrong');
            setIsLoading(false);
        }
    };
    return(// Styled Card with hover effect
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        whileHover: {
            y: -5,
            scale: 1.03
        },
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20
        },
        className: "h-full" // Ensure motion div takes full height for flex parent
        ,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: "glass-card border border-white/15 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "p-6 flex flex-col flex-grow space-y-4",
                children: [
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-grow space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                        className: "w-6 h-6"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/account/credit-pack-card.tsx",
                                        lineNumber: 64,
                                        columnNumber: 15
                                    }, this),
                                    creditPack.amount.toLocaleString(),
                                    " Credits"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/account/credit-pack-card.tsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-foreground/95",
                                        children: creditPack.name
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/account/credit-pack-card.tsx",
                                        lineNumber: 70,
                                        columnNumber: 15
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-muted-foreground",
                                        children: creditPack.description
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/account/credit-pack-card.tsx",
                                        lineNumber: 71,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/account/credit-pack-card.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/account/credit-pack-card.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-3xl font-bold text-primary/90 mt-auto",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(creditPack.price)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/account/credit-pack-card.tsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: handlePurchase,
                        className: "w-full glass-button bg-gradient-to-r from-secondary to-accent text-white hover:opacity-95 hover:shadow-lg transition-all duration-300 shadow-md text-base py-2.5 font-semibold" // Styled button
                        ,
                        disabled: isLoading || !creditPack.priceId,
                        children: isLoading ? 'Processing...' : 'Purchase'
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/account/credit-pack-card.tsx",
                        lineNumber: 79,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/account/credit-pack-card.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/account/credit-pack-card.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/account/credit-pack-card.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this));
}
_s(CreditPackCard, "EmvgwIb3cHpoFpeP+WmEDbjx4y4=");
_c = CreditPackCard;
var _c;
__turbopack_context__.k.register(_c, "CreditPackCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=apps_web_src_573720d3._.js.map