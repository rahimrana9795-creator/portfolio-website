/**
 * Sends the contact-form notification email.
 *
 * Works out of the box with a Resend API key (RESEND_API_KEY) and
 * CONTACT_EMAIL set. Without a key the message is still saved to the
 * database and this quietly no-ops.
 */
export async function sendContactEmail(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL || process.env.EMAIL_TO;
  if (!apiKey || !to) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: [input.email],
        subject: `New message from ${input.name}: ${input.subject}`,
        text: `Name: ${input.name}\nEmail: ${input.email}\nSubject: ${input.subject}\n\n${input.message}`,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
