"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import {
  updateUser,
  changePassword,
  deleteUser,
  signOut,
} from "@/lib/auth-client";
import {
  createUpdateProfileSchema,
  createChangePasswordSchema,
  createDeleteAccountSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
  type DeleteAccountInput,
} from "@/lib/validations/auth";

export function AccountForms({ name, email }: { name: string; email: string }) {
  return (
    <div className="flex flex-col gap-6">
      <ProfileCard name={name} email={email} />
      <PasswordCard />
      <DangerZoneCard />
    </div>
  );
}

function ProfileCard({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const t = useTranslations("account.profile");
  const tv = useTranslations("account.validation");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(
      createUpdateProfileSchema({ nameRequired: tv("nameRequired") })
    ),
    defaultValues: { name },
  });

  async function onSubmit(values: UpdateProfileInput) {
    setLoading(true);
    const { error } = await updateUser(values);
    setLoading(false);

    if (error) {
      toast.error(error.message ?? t("genericError"));
      return;
    }
    toast.success(t("success"));
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{email}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="flex flex-col gap-1.5">
          <Label htmlFor="name">{t("name")}</Label>
          <Input id="name" {...register("name")} />
          {errors.name ? (
            <p className="text-destructive text-sm">{errors.name.message}</p>
          ) : null}
        </CardContent>
        <CardFooter className="border-t-0 bg-transparent">
          <Button type="submit" disabled={loading}>
            {loading ? t("saving") : t("save")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function PasswordCard() {
  const t = useTranslations("account.password");
  const tv = useTranslations("account.validation");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(
      createChangePasswordSchema({
        currentPasswordRequired: tv("currentPasswordRequired"),
        passwordMin: tv("passwordMin"),
      })
    ),
  });

  async function onSubmit(values: ChangePasswordInput) {
    setLoading(true);
    const { error } = await changePassword({
      ...values,
      revokeOtherSessions: true,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? t("genericError"));
      return;
    }
    toast.success(t("success"));
    reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currentPassword">{t("current")}</Label>
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              {...register("currentPassword")}
            />
            {errors.currentPassword ? (
              <p className="text-destructive text-sm">
                {errors.currentPassword.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="newPassword">{t("new")}</Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              {...register("newPassword")}
            />
            {errors.newPassword ? (
              <p className="text-destructive text-sm">
                {errors.newPassword.message}
              </p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="border-t-0 bg-transparent">
          <Button type="submit" disabled={loading}>
            {loading ? t("submitting") : t("submit")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function DangerZoneCard() {
  const router = useRouter();
  const t = useTranslations("account.danger");
  const tv = useTranslations("account.validation");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(
      createDeleteAccountSchema({ passwordRequired: tv("passwordRequired") })
    ),
  });

  async function onSubmit(values: DeleteAccountInput) {
    setLoading(true);
    const { error } = await deleteUser(values);
    setLoading(false);

    if (error) {
      toast.error(error.message ?? t("genericError"));
      return;
    }
    toast.success(t("success"));
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="flex flex-col gap-1.5">
          <Label htmlFor="delete-password">{t("password")}</Label>
          <Input
            id="delete-password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-destructive text-sm">
              {errors.password.message}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="border-t-0 bg-transparent">
          <Button type="submit" variant="destructive" disabled={loading}>
            {loading ? t("submitting") : t("submit")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
