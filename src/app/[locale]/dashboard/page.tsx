import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "@/i18n/navigation";
import { HealthStatus } from "@/components/health-status";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect({ href: "/login", locale: await getLocale() });
  }

  const t = await getTranslations("dashboard");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground mt-2">
        {t("signedInAs", { email: session!.user.email })}
      </p>
      <div className="mt-4">
        <HealthStatus />
      </div>
    </div>
  );
}
