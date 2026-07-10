"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Link, useRouter } from "@/i18n/navigation";
import { signOut, useSession } from "@/lib/auth-client";

export function Header() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const t = useTranslations("nav");

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          {t("brand")}
        </Link>

        <nav className="flex items-center gap-3">
          <LocaleSwitcher />
          <ThemeToggle />
          {isPending ? null : session ? (
            <>
              <Link href="/dashboard" className="text-sm">
                {t("dashboard")}
              </Link>
              <Link href="/notes" className="text-sm">
                {t("notes")}
              </Link>
              {session.user.role === "admin" && (
                <Link href="/admin" className="text-sm">
                  {t("admin")}
                </Link>
              )}
              <Link
                href="/account"
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                {session.user.name.trim() || session.user.email}
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await signOut();
                  toast.success(t("signedOut"));
                  router.push("/");
                  router.refresh();
                }}
              >
                {t("signOut")}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm">
                {t("signIn")}
              </Link>
              <Button size="sm" render={<Link href="/register" />}>
                {t("signUp")}
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
