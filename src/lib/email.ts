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
    viewToken?: string;
}

const emailTemplates = {
    en: {
        appName: "Secret Santa",
        subject: "🎅 Your Secret Santa Assignment",
        greeting: (name: string) => `Hello ${name}!`,
        intro: (groupName: string) =>
            `You have been assigned a Secret Santa gift recipient in the group "${groupName}"!`,
        assignment: (receiverName: string) =>
            `You will be giving a gift to: <strong>${receiverName}</strong>`,
        reminder: "Remember: Keep it a secret! 🤫",
        closing: "Have fun shopping and Happy Holidays!",
        footer: "Secret Santa App by",
        viewOnline: "View Your Assignment Online",
        viewOnlineText:
            "Click the button below to view your assignment anytime:",
    },
    es: {
        appName: "Amigo Invisible",
        subject: "🎅 Tu asignación de Amigo Invisible",
        greeting: (name: string) => `¡Hola ${name}!`,
        intro: (groupName: string) =>
            `¡Se te ha asignado un destinatario de regalo en el grupo "${groupName}"!`,
        assignment: (receiverName: string) =>
            `Le darás un regalo a: <strong>${receiverName}</strong>`,
        reminder: "Recuerda: ¡Mantenlo en secreto! 🤫",
        closing: "¡Disfruta comprando y Felices Fiestas!",
        footer: "Aplicación de Amigo Invisible de",
        viewOnline: "Ver Tu Asignación en Línea",
        viewOnlineText:
            "Haz clic en el botón para ver tu asignación en cualquier momento:",
    },
};

export async function sendSecretSantaEmail({
    giverName,
    giverEmail,
    receiverName,
    groupName,
    locale,
    viewToken,
}: SendSecretSantaEmailParams): Promise<{ success: boolean; error?: string }> {
    const template = emailTemplates[locale] || emailTemplates.en;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const viewUrl = viewToken
        ? `${baseUrl}/${locale}/assignment/${viewToken}`
        : undefined;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #fef3f3 0%, #f0fdf4 50%, #fefce8 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: white; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); overflow: hidden;">
                
                <!-- Header with festive gradient -->
                <tr>
                  <td style="background: linear-gradient(135deg, #c81e1e 0%, #14532d 100%); padding: 40px 30px; text-align: center; position: relative;">
                    <h1 style="margin: 0; font-size: 28px;">🎅 ${
                        template.appName
                    } 🎁</h1>
                  </td>
                </tr>
                
                <!-- Main content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">
                      ${template.greeting(giverName)}
                    </h2>
                    
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      ${template.intro(groupName)}
                    </p>
                    
                    <!-- Assignment card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td style="background: linear-gradient(135deg, rgba(200, 30, 30, 0.05) 0%, rgba(20, 83, 45, 0.05) 100%); padding: 30px; border-radius: 12px; border: 2px solid #eab308; box-shadow: 0 4px 12px rgba(234, 179, 8, 0.2);">
                          <div style="text-align: center; font-size: 36px; margin-bottom: 15px;">🎁</div>
                          <p style="color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0; text-align: center; font-weight: 600;">
                            You're giving to
                          </p>
                          <p style="color: #1f2937; font-size: 28px; margin: 0; text-align: center; font-weight: 700;">
                            ${receiverName}
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Reminder box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td style="background: #fef3f3; padding: 20px; border-radius: 8px; border-left: 4px solid #c81e1e;">
                          <p style="color: #991b1b; font-size: 16px; margin: 0; text-align: center; font-weight: 500;">
                            🤫 ${template.reminder}
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #4b5563; font-size: 16px; text-align: center; margin: 30px 0 0 0; line-height: 1.6;">
                      ${template.closing}
                    </p>
                    
                    <!-- View Online Button -->
                    ${
                        viewUrl
                            ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0 0 0;">
                      <tr>
                        <td align="center">
                          <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0;">
                            ${template.viewOnlineText}
                          </p>
                          <a href="${viewUrl}" style="display: inline-block; background: linear-gradient(135deg, #c81e1e 0%, #14532d 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(200, 30, 30, 0.3);">
                            🎁 ${template.viewOnline}
                          </a>
                        </td>
                      </tr>
                    </table>`
                            : ""
                    }
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <div style="text-align: center; padding: 20px; color: #9ca3af;">
                      <span>
                          © ${new Date().getFullYear()} ${template.footer}
                          <a style="color: #9ca3af; font-weight: bold" href="https://pleyt.dev">@pleyt.dev</a>
                      </span>
                    </div>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
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
