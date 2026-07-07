import { z } from "zod";

export function createForgotPasswordSchema(t: {
  emailRequired: string;
  emailInvalid: string;
}) {
  return z.object({
    email: z.string().min(1, t.emailRequired).email(t.emailInvalid),
  });
}

export type ForgotPasswordInput = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

export function createResetPasswordSchema(t: { passwordMin: string }) {
  return z.object({
    password: z.string().min(8, t.passwordMin),
  });
}

export type ResetPasswordInput = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
