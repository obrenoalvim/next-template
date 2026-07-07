import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required").max(5000),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export function createNoteFormSchema(t: {
  titleRequired: string;
  contentRequired: string;
}) {
  return z.object({
    title: z.string().min(1, t.titleRequired).max(200),
    content: z.string().min(1, t.contentRequired).max(5000),
  });
}

export type Note = {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
