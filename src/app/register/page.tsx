"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { signUp } from "@/lib/auth-client";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setLoading(true);
    const { error } = await signUp.email(values);
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Could not create account.");
      return;
    }
    toast.success("Account created.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="from-muted/40 to-background flex min-h-[calc(100vh-7rem)] items-center justify-center bg-gradient-to-b px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl">
            <UserIcon className="size-5" />
          </div>
          <h1 className="text-xl font-semibold">Create an account</h1>
          <p className="text-muted-foreground text-sm">
            It only takes a minute to get started
          </p>
        </div>

        <Card className="shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <UserIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                  <Input
                    id="name"
                    autoComplete="name"
                    className="pl-8"
                    aria-invalid={!!errors.name}
                    {...register("name")}
                  />
                </div>
                {errors.name ? (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="password">Password</Label>
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
            <CardFooter className="flex-col gap-3 border-t-0 bg-transparent">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Sign up"}
              </Button>
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-foreground underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
