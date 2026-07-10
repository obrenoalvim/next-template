import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { note } from "@/db/schema";
import { logger } from "@/lib/logger";

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     security: [{ sessionCookie: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Note deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const [deleted] = await db
      .delete(note)
      .where(and(eq(note.id, id), eq(note.userId, session.user.id)))
      .returning({ id: note.id });

    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error(
      { error, userId: session.user.id, noteId: id },
      "failed to delete note"
    );
    return NextResponse.json(
      { message: "Could not delete note" },
      { status: 500 }
    );
  }
}
