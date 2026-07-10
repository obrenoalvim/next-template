import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const pageKeys = [
  "",
  "login",
  "register",
  "forgotPassword",
  "resetPassword",
  "dashboard",
  "account",
  "notes",
  "admin",
  "routes",
] as const;

const pagePaths: Record<(typeof pageKeys)[number], string> = {
  "": "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  account: "/account",
  notes: "/notes",
  admin: "/admin",
  routes: "/routes",
};

const pageLabelKeys: Record<(typeof pageKeys)[number], string> = {
  "": "home",
  login: "login",
  register: "register",
  forgotPassword: "forgotPassword",
  resetPassword: "resetPassword",
  dashboard: "dashboard",
  account: "account",
  notes: "notes",
  admin: "admin",
  routes: "routes",
};

const apiRoutes = [
  {
    path: "/api/auth/[...all]",
    description:
      "Better Auth's route handler (sign-in, sign-up, session, sign-out).",
  },
  {
    path: "/api/health",
    description:
      "Checks the database connection. Used by the Docker healthcheck.",
  },
  {
    path: "/api/notes",
    description: "GET/POST notes for the current user.",
  },
  {
    path: "/api/notes/[id]",
    description: "DELETE a note owned by the current user.",
  },
];

export default async function RoutesPage() {
  const t = await getTranslations("routes");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground mt-2">{t("subtitle")}</p>

      <h2 className="mt-8 text-lg font-medium">{t("pagesHeading")}</h2>
      <div className="mt-3 flex flex-col divide-y rounded-xl border">
        {pageKeys.map((key) => (
          <Link
            key={key || "home"}
            href={pagePaths[key]}
            className="hover:bg-muted/50 flex flex-col gap-0.5 px-4 py-3 transition-colors"
          >
            <span className="font-medium">
              {t(`labels.${pageLabelKeys[key]}`)}{" "}
              <code className="text-muted-foreground text-sm font-normal">
                {pagePaths[key]}
              </code>
            </span>
            <span className="text-muted-foreground text-sm">
              {key === "" ? t("home") : t(key)}
            </span>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-medium">{t("apiHeading")}</h2>
      <div className="mt-3 flex flex-col divide-y rounded-xl border">
        {apiRoutes.map((route) => (
          <div key={route.path} className="flex flex-col gap-0.5 px-4 py-3">
            <code className="text-sm font-medium">{route.path}</code>
            <span className="text-muted-foreground text-sm">
              {route.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
