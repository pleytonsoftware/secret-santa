import type { Locale } from "@/i18n";
import { Resend } from "resend";

// Lazy initialization to avoid build-time errors
let resendClient: Resend | null = null;

function getResendClient(): Resend {
    if (!resendClient) {
        resendClient = new Resend(process.env.RESEND_API_KEY || "");
    }
    return resendClient;
}

interface SendSecretSantaEmailParams {
    giverName: string;
    giverEmail: string;
    receiverName: string;
    groupName: string;
    locale: Locale;
}

const emailTemplates = {
    en: {
        subject: "🎅 Your Secret Santa Assignment",
        greeting: (name: string) => `Hello ${name}!`,
        intro: (groupName: string) =>
            `You have been assigned a Secret Santa gift recipient in the group "${groupName}"!`,
        assignment: (receiverName: string) =>
            `You will be giving a gift to: <strong>${receiverName}</strong>`,
        reminder: "Remember: Keep it a secret! 🤫",
        closing: "Have fun shopping and Happy Holidays!",
        footer: "Secret Santa App",
    },
    es: {
        subject: "🎅 Tu asignación de Amigo Secreto",
        greeting: (name: string) => `¡Hola ${name}!`,
        intro: (groupName: string) =>
            `¡Se te ha asignado un destinatario de regalo en el grupo "${groupName}"!`,
        assignment: (receiverName: string) =>
            `Le darás un regalo a: <strong>${receiverName}</strong>`,
        reminder: "Recuerda: ¡Mantenlo en secreto! 🤫",
        closing: "¡Disfruta comprando y Felices Fiestas!",
        footer: "Aplicación de Amigo Secreto",
    },
};

export async function sendSecretSantaEmail({
    giverName,
    giverEmail,
    receiverName,
    groupName,
    locale,
}: SendSecretSantaEmailParams): Promise<{ success: boolean; error?: string }> {
    const template = emailTemplates[locale] || emailTemplates.en;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${template.subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626, #16a34a); padding: 30px; border-radius: 10px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🎅 Secret Santa 🎁</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937;">${template.greeting(giverName)}</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            ${template.intro(groupName)}
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
            <p style="color: #1f2937; font-size: 18px; margin: 0;">
              ${template.assignment(receiverName)}
            </p>
          </div>
          <p style="color: #6b7280; font-size: 16px; text-align: center; font-style: italic;">
            ${template.reminder}
          </p>
          <p style="color: #4b5563; font-size: 16px; text-align: center;">
            ${template.closing}
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af;">
          <p style="margin: 0; font-size: 14px;">${template.footer}</p>
        </div>
      </body>
    </html>
  `;

    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn("RESEND_API_KEY not configured, email not sent");
            return { success: true };
        }

        const resend = getResendClient();
        const { error } = await resend.emails.send({
            from:
                process.env.RESEND_FROM_EMAIL ||
                "Secret Santa <onboarding@resend.dev>",
            to: giverEmail,
            subject: template.subject,
            html: htmlContent,
        });

        if (error) {
            console.error("Failed to send email:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error("Email sending error:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}
