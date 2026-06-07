import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.GITHUB_TOKEN ?? "";
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? "";
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV ?? null,
    port: process.env.PORT ?? null,
    githubToken: {
      present: token.length > 0,
      length: token.length,
      prefix: token.length > 0 ? token.slice(0, 4) : null,
    },
    upstash: {
      url: { present: redisUrl.length > 0, length: redisUrl.length },
      token: { present: redisToken.length > 0, length: redisToken.length },
    },
  });
}
