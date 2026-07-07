import Link from "next/link";

const pages = [
  {
    path: "/",
    label: "Home",
    description:
      "Landing page with the stack overview and get-started/sign-in CTAs.",
  },
  {
    path: "/login",
    label: "Sign in",
    description: "Email/password login form.",
  },
  { path: "/register", label: "Sign up", description: "Create an account." },
  {
    path: "/dashboard",
    label: "Dashboard",
    description: "Protected page — redirects to /login without a session.",
  },
  { path: "/routes", label: "Routes", description: "This page." },
];

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
];

export default function RoutesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Routes</h1>
      <p className="text-muted-foreground mt-2">
        Every page and API route this template ships with.
      </p>

      <h2 className="mt-8 text-lg font-medium">Pages</h2>
      <div className="mt-3 flex flex-col divide-y rounded-xl border">
        {pages.map((page) => (
          <Link
            key={page.path}
            href={page.path}
            className="hover:bg-muted/50 flex flex-col gap-0.5 px-4 py-3 transition-colors"
          >
            <span className="font-medium">
              {page.label}{" "}
              <code className="text-muted-foreground text-sm font-normal">
                {page.path}
              </code>
            </span>
            <span className="text-muted-foreground text-sm">
              {page.description}
            </span>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-medium">API routes</h2>
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
