import nodemailer from "nodemailer";
import { logger } from "@/lib/logger";

const gmailUser = process.env.GMAIL_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

const transporter =
  gmailUser && gmailAppPassword
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailAppPassword },
      })
    : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!transporter) {
    logger.warn(
      { to, subject },
      "GMAIL_USER/GMAIL_APP_PASSWORD not set — logging email instead of sending"
    );
    console.log(
      `\n--- Email (dev fallback) ---\nTo: ${to}\nSubject: ${subject}\n\n${html}\n---\n`
    );
    return;
  }

  try {
    await transporter.sendMail({ from: gmailUser, to, subject, html });
    logger.info({ to, subject }, "email sent");
  } catch (error) {
    logger.error({ error, to, subject }, "failed to send email");
    throw error;
  }
}
