"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { requestPasswordReset } from "@/lib/auth-client";
import {
  createForgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/password-reset";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");
  const tv = useTranslations("auth.validation");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(
      createForgotPasswordSchema({
        emailRequired: tv("emailRequired"),
        emailInvalid: tv("emailInvalid"),
      })
    ),
  });

  async function onSubmit(values: ForgotPasswordInput) {
    setLoading(true);
    const { error } = await requestPasswordReset({
      email: values.email,
      redirectTo: "/reset-password",
    });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? t("genericError"));
      return;
    }
    setSent(true);
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
          {sent ? (
            <CardContent className="text-muted-foreground py-6 text-center text-sm">
              {t("sent")}
            </CardContent>
          ) : (
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
              </CardContent>
              <CardFooter className="flex-col gap-3 border-t-0 bg-transparent">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t("submitting") : t("submit")}
                </Button>
                <p className="text-muted-foreground text-sm">
                  <Link href="/login" className="text-foreground underline">
                    {t("backToSignIn")}
                  </Link>
                </p>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
