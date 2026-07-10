import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "@/i18n/navigation";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    redirect({ href: "/dashboard", locale: await getLocale() });
  }

  const { users } = await auth.api.listUsers({
    headers: await headers(),
    query: {},
  });

  const t = await getTranslations("admin");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground mt-2">{t("subtitle")}</p>

      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-4 py-2 font-medium">{t("email")}</th>
              <th className="px-4 py-2 font-medium">{t("role")}</th>
              <th className="px-4 py-2 font-medium">{t("banned")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role ?? "user"}</td>
                <td className="px-4 py-2">{user.banned ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
