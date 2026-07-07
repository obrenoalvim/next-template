import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { NotesView } from "@/components/notes-view";

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Notes</h1>
      <p className="text-muted-foreground mt-2">
        Example CRUD resource — schema, API route, api-client, and TanStack
        Query/Table wired together. Delete this page once you don&apos;t need
        the reference anymore.
      </p>

      <div className="mt-8">
        <NotesView />
      </div>
    </div>
  );
}
