function layout(title: string, bodyHtml: string, url: string, cta: string) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
      <h1 style="font-size: 20px; margin-bottom: 16px;">${title}</h1>
      <p style="color: #555; line-height: 1.5;">${bodyHtml}</p>
      <a href="${url}" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 6px;">${cta}</a>
      <p style="color: #999; font-size: 12px; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
}

export function verificationEmail(url: string) {
  return layout(
    "Verify your email",
    "Confirm your email address to finish setting up your account.",
    url,
    "Verify email"
  );
}

export function resetPasswordEmail(url: string) {
  return layout(
    "Reset your password",
    "Click the button below to choose a new password. This link expires soon.",
    url,
    "Reset password"
  );
}
