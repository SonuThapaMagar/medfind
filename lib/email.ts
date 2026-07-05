import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPharmacyCredentials({
  email,
  name,
  pharmacyName,
  tempPassword,
}: {
  email: string;
  name: string;
  pharmacyName: string;
  tempPassword: string;
}) {
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: email,
    subject: `Your MedFind pharmacy account — ${pharmacyName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #01377d;">Welcome to MedFind</h2>
        <p>Hi ${name},</p>
        <p>Your pharmacy account for <strong>${pharmacyName}</strong> has been created.</p>

        <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 8px; font-size: 13px; color: #6c7e93;">Login credentials</p>
          <p style="margin: 0 0 4px;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0;"><strong>Temporary password:</strong> ${tempPassword}</p>
        </div>

        <p style="color: #e94f37; font-size: 13px;">
          You will be asked to change your password on first login.
        </p>

        <a href="${process.env.NEXTAUTH_URL}/login"
           style="display: inline-block; background: #01377d; color: white;
                  padding: 10px 20px; border-radius: 8px; text-decoration: none; margin-top: 8px;">
          Login to MedFind
        </a>
      </div>
    `,
  });
}
