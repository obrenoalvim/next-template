import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { logger } from "@/lib/logger";

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API and database health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Healthy
 *       503:
 *         description: Database unreachable
 */
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
