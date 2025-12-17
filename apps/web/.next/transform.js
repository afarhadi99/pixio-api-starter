const CHUNK_PUBLIC_PATH = "transform.js";
const runtime = require("./build/chunks/[turbopack]_runtime.js");
runtime.loadChunk("build/chunks/apps_web_postcss_config_mjs_transform_ts_08c45007._.js");
runtime.loadChunk("build/chunks/[root-of-the-server]__483c225c._.js");
runtime.getOrInstantiateRuntimeModule("[turbopack-node]/globals.ts [postcss] (ecmascript)", CHUNK_PUBLIC_PATH);
runtime.getOrInstantiateRuntimeModule("[turbopack-node]/ipc/evaluate.ts/evaluate.js { INNER => \"[project]/apps/web/postcss.config.mjs/transform.ts { CONFIG => \\\"[project]/apps/web/postcss.config.mjs [postcss] (ecmascript)\\\" } [postcss] (ecmascript)\", RUNTIME => \"[turbopack-node]/ipc/evaluate.ts [postcss] (ecmascript)\" } [postcss] (ecmascript)", CHUNK_PUBLIC_PATH);
module.exports = runtime.getOrInstantiateRuntimeModule("[turbopack-node]/ipc/evaluate.ts/evaluate.js { INNER => \"[project]/apps/web/postcss.config.mjs/transform.ts { CONFIG => \\\"[project]/apps/web/postcss.config.mjs [postcss] (ecmascript)\\\" } [postcss] (ecmascript)\", RUNTIME => \"[turbopack-node]/ipc/evaluate.ts [postcss] (ecmascript)\" } [postcss] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
