import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "@/i18n/navigation";
import { AccountForms } from "@/components/account-forms";

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect({ href: "/login", locale: await getLocale() });
  }

  const t = await getTranslations("account");

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground mt-2">{t("subtitle")}</p>

      <div className="mt-8">
        <AccountForms name={session!.user.name} email={session!.user.email} />
      </div>
    </div>
  );
}
