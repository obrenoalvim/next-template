"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

export function Header() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          next-template
        </Link>

        <nav className="flex items-center gap-3">
          {isPending ? null : session ? (
            <>
              <Link href="/dashboard" className="text-sm">
                Dashboard
              </Link>
              <span className="text-muted-foreground text-sm">
                {session.user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await signOut();
                  router.push("/");
                  router.refresh();
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm">
                Sign in
              </Link>
              <Button size="sm" render={<Link href="/register" />}>
                Sign up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
