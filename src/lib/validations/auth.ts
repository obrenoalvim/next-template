import { z } from "zod";

type ValidationMessages = {
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMin: string;
};

export function createLoginSchema(t: ValidationMessages) {
  return z.object({
    email: z.string().min(1, t.emailRequired).email(t.emailInvalid),
    password: z.string().min(1, t.passwordRequired),
  });
}

export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;

export function createRegisterSchema(t: ValidationMessages) {
  return z.object({
    name: z.string().min(1, t.nameRequired),
    email: z.string().min(1, t.emailRequired).email(t.emailInvalid),
    password: z.string().min(8, t.passwordMin),
  });
}

export type RegisterInput = z.infer<ReturnType<typeof createRegisterSchema>>;

export function createUpdateProfileSchema(
  t: Pick<ValidationMessages, "nameRequired">
) {
  return z.object({
    name: z.string().min(1, t.nameRequired),
  });
}

export type UpdateProfileInput = z.infer<
  ReturnType<typeof createUpdateProfileSchema>
>;

export function createChangePasswordSchema(
  t: { currentPasswordRequired: string } & Pick<
    ValidationMessages,
    "passwordMin"
  >
) {
  return z.object({
    currentPassword: z.string().min(1, t.currentPasswordRequired),
    newPassword: z.string().min(8, t.passwordMin),
  });
}

export type ChangePasswordInput = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;

export function createDeleteAccountSchema(
  t: Pick<ValidationMessages, "passwordRequired">
) {
  return z.object({
    password: z.string().min(1, t.passwordRequired),
  });
}

export type DeleteAccountInput = z.infer<
  ReturnType<typeof createDeleteAccountSchema>
>;
