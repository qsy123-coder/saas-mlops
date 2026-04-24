module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/pages/api/idea.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>handler
]);
const config = {
    api: {
        bodyParser: false
    }
};
const backendOrigin = process.env.IDEA_API_PROXY_ORIGIN ?? "http://127.0.0.1:8000";
async function handler(req, res) {
    const authorization = req.headers.authorization ?? "";
    const upstream = await fetch(`${backendOrigin}/api`, {
        headers: {
            Authorization: authorization
        }
    });
    if (!upstream.ok || !upstream.body) {
        res.status(upstream.status).end(upstream.statusText);
        return;
    }
    res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no"
    });
    const reader = upstream.body.getReader();
    try {
        while(true){
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
            if (typeof res.flush === "function") {
                res.flush();
            }
        }
    } finally{
        res.end();
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__03sbcrv._.js.map