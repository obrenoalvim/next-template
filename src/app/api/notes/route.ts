import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { note } from "@/db/schema";
import { logger } from "@/lib/logger";
import { createNoteSchema } from "@/lib/validations/note";

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: List notes for the current user
 *     tags: [Notes]
 *     security: [{ sessionCookie: [] }]
 *     responses:
 *       200:
 *         description: Notes list
 *       401:
 *         description: Unauthorized
 */
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const notes = await db
    .select()
    .from(note)
    .where(eq(note.userId, session.user.id))
    .orderBy(desc(note.createdAt));

  return NextResponse.json(notes);
}

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a note
 *     tags: [Notes]
 *     security: [{ sessionCookie: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 5000
 *     responses:
 *       201:
 *         description: Note created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = createNoteSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  try {
    const [created] = await db
      .insert(note)
      .values({ ...parsed.data, userId: session.user.id })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    logger.error({ error, userId: session.user.id }, "failed to create note");
    return NextResponse.json(
      { message: "Could not create note" },
      { status: 500 }
    );
  }
}
