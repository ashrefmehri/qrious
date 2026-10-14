import "server-only";

// Sending e-mails to students. No e-mail service yet (docs/11-open-questions.md):
// in development the code is printed in the terminal running `npm run dev`.
// In production this throws, so a missing sender is never silent.

export async function sendVerificationCode(email: string, code: string): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("No e-mail service configured: verification codes cannot be sent.");
  }
  console.log(`\n[Qrious] Code de vérification pour ${email} : ${code}\n`);
}
