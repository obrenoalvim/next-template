import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AccountForms } from "@/components/account-forms";

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-semibold">Account</h1>
      <p className="text-muted-foreground mt-2">
        Manage your profile, password, and account.
      </p>

      <div className="mt-8">
        <AccountForms name={session.user.name} email={session.user.email} />
      </div>
    </div>
  );
}
