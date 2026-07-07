"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  updateUser,
  changePassword,
  deleteUser,
  signOut,
} from "@/lib/auth-client";
import {
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
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
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name },
  });

  async function onSubmit(values: UpdateProfileInput) {
    setLoading(true);
    const { error } = await updateUser(values);
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Could not update profile.");
      return;
    }
    toast.success("Profile updated.");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>{email}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name ? (
            <p className="text-destructive text-sm">{errors.name.message}</p>
          ) : null}
        </CardContent>
        <CardFooter className="border-t-0 bg-transparent">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function PasswordCard() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(values: ChangePasswordInput) {
    setLoading(true);
    const { error } = await changePassword({
      ...values,
      revokeOtherSessions: true,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Could not change password.");
      return;
    }
    toast.success("Password changed.");
    reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Changing your password signs you out of other sessions.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currentPassword">Current password</Label>
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
            <Label htmlFor="newPassword">New password</Label>
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
            {loading ? "Changing..." : "Change password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function DangerZoneCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
  });

  async function onSubmit(values: DeleteAccountInput) {
    setLoading(true);
    const { error } = await deleteUser(values);
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Could not delete account.");
      return;
    }
    toast.success("Account deleted.");
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle>Delete account</CardTitle>
        <CardDescription>
          This permanently deletes your account. There is no undo.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="flex flex-col gap-1.5">
          <Label htmlFor="delete-password">Password</Label>
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
            {loading ? "Deleting..." : "Delete account"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
