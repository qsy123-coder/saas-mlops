import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: { bodyParser: false },
};

const backendOrigin =
  process.env.IDEA_API_PROXY_ORIGIN ?? "http://127.0.0.1:8000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authorization = req.headers.authorization ?? "";

  const upstream = await fetch(`${backendOrigin}/api`, {
    headers: { Authorization: authorization },
  });

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
