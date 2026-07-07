import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({ status: "ok", database: "up" });
  } catch (error) {
    logger.error({ error }, "health check: database unreachable");
    return NextResponse.json(
      { status: "error", database: "down" },
      { status: 503 }
    );
  }
}
