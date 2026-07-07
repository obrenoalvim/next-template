"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link, useRouter } from "@/i18n/navigation";
import { resetPassword } from "@/lib/auth-client";
import {
  createResetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/password-reset";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const t = useTranslations("auth.resetPassword");
  const tv = useTranslations("auth.validation");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(
      createResetPasswordSchema({ passwordMin: tv("passwordMin") })
    ),
  });

  async function onSubmit(values: ResetPasswordInput) {
    if (!token) {
      toast.error(t("missingToken"));
      return;
    }

    setLoading(true);
    const { error } = await resetPassword({
      newPassword: values.password,
      token,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? t("genericError"));
      return;
    }
    toast.success(t("success"));
    router.push("/login");
  }

  return (
    <div className="from-muted/40 to-background flex min-h-[calc(100vh-7rem)] items-center justify-center bg-gradient-to-b px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl">
            <KeyRound className="size-5" />
          </div>
          <h1 className="text-xl font-semibold">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>

        <Card className="shadow-lg">
          {!token ? (
            <CardContent className="text-muted-foreground py-6 text-center text-sm">
              {t("invalidToken")}{" "}
              <Link
                href="/forgot-password"
                className="text-foreground underline"
              >
                {t("requestNew")}
              </Link>
              .
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">{t("newPassword")}</Label>
                  <div className="relative">
                    <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
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
              <CardFooter className="border-t-0 bg-transparent">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t("submitting") : t("submit")}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
