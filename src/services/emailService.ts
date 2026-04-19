import { Resend } from 'resend';

// On n'instancie Resend que si la clé est présente pour éviter le crash au démarrage
const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

export const ADMIN_EMAIL = "sebbardev.digital@gmail.com";
export const FROM_EMAIL = "Premium Car Rental <onboarding@resend.dev>";

/**
 * Fonction utilitaire pour envoyer des emails de manière sécurisée (ne plante pas si pas de clé)
 */
export async function sendEmail({ to, subject, react }: { to: string, subject: string, react: any }) {
  if (!resend) {
    console.log("--------------------------------------------------");
    console.log("📧 [MOCK EMAIL] - Mode Développement (Pas de clé API)");
    console.log(`Destinataire: ${to}`);
    console.log(`Sujet: ${subject}`);
    console.log("Contenu: (Template React-Email détecté)");
    console.log("--------------------------------------------------");
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      react,
    });
    return { success: true, data };
  } catch (error) {
    console.error("❌ [EMAIL ERROR]:", error);
    return { success: false, error };
  }
}
