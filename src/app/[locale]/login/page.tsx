"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link, useRouter } from "@/i18n/navigation";
import { signIn } from "@/lib/auth-client";
import { createLoginSchema, type LoginInput } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth.login");
  const tv = useTranslations("auth.validation");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(
      createLoginSchema({
        nameRequired: "",
        emailRequired: tv("emailRequired"),
        emailInvalid: tv("emailInvalid"),
        passwordRequired: tv("passwordRequired"),
        passwordMin: "",
      })
    ),
  });

  async function onSubmit(values: LoginInput) {
    setLoading(true);
    const { error } = await signIn.email(values);
    setLoading(false);

    if (error) {
      toast.error(error.message ?? t("genericError"));
      return;
    }
    toast.success(t("success"));
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="from-muted/40 to-background flex min-h-[calc(100vh-7rem)] items-center justify-center bg-gradient-to-b px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl">
            <Lock className="size-5" />
          </div>
          <h1 className="text-xl font-semibold">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>

        <Card className="shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">{t("email")}</Label>
                <div className="relative">
                  <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="pl-8"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                </div>
                {errors.email ? (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Link
                    href="/forgot-password"
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="pl-8"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                </div>
                {errors.password ? (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3 border-t-0 bg-transparent">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("submitting") : t("submit")}
              </Button>
              <p className="text-muted-foreground text-sm">
                {t("noAccount")}{" "}
                <Link href="/register" className="text-foreground underline">
                  {t("signUp")}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
