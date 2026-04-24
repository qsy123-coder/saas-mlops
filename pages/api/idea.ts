import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: { bodyParser: false },
};

function getBackendOrigin(): string {
  if (process.env.IDEA_API_PROXY_ORIGIN) {
    return process.env.IDEA_API_PROXY_ORIGIN;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://127.0.0.1:8000";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authorization = req.headers.authorization ?? "";
  const backendOrigin = getBackendOrigin();

  let upstream: Response;
  try {
    upstream = await fetch(`${backendOrigin}/api`, {
      headers: { Authorization: authorization },
    });
  } catch (err) {
    res.status(502).json({ error: "Backend unreachable" });
    return;
  }

  if (!upstream.ok || !upstream.body) {
    res.status(upstream.status).end(upstream.statusText);
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const reader = upstream.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
      if (typeof (res as unknown as { flush?: () => void }).flush === "function") {
        (res as unknown as { flush: () => void }).flush();
      }
    }
  } finally {
    res.end();
  }
}
