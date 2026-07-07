import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "@/i18n/navigation";
import { NotesView } from "@/components/notes-view";

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect({ href: "/login", locale: await getLocale() });
  }

  const t = await getTranslations("notes");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground mt-2">{t("subtitle")}</p>

      <div className="mt-8">
        <NotesView />
      </div>
    </div>
  );
}
