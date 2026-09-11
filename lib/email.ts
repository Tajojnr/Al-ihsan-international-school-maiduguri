import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.EMAIL_FROM || "Al-Ihsan Admissions <onboarding@resend.dev>";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: EmailPayload) {
  if (!resend) {
    console.log(`[Email Service - Dev Simulation] To: ${to} | Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[Email Service Error]", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("[Email Service Exception]", err);
    return { success: false, error: "Failed to dispatch email." };
  }
}

// 1. Admission Application Submitted Email
export async function sendAdmissionConfirmationEmail({
  toEmail,
  applicantName,
  studentName,
  referenceNumber,
  campusName,
  track,
}: {
  toEmail: string;
  applicantName: string;
  studentName: string;
  referenceNumber: string;
  campusName: string;
  track: string;
}) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/portal`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A0E14; color: #f8fafc; margin: 0; padding: 40px 20px; }
          .container { max-width: 580px; margin: 0 auto; background: #121824; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; }
          .header { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 24px; }
          .badge { display: inline-block; background: rgba(201,160,99,0.15); color: #c9a063; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
          .title { font-size: 22px; font-weight: 700; color: #ffffff; margin: 12px 0 4px 0; }
          .ref-box { background: rgba(214,18,126,0.1); border: 1px solid rgba(214,18,126,0.3); border-radius: 12px; padding: 16px; margin: 24px 0; text-align: center; }
          .ref-title { font-size: 11px; color: #d6127e; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
          .ref-number { font-size: 24px; font-weight: 800; color: #ffffff; font-family: monospace; margin-top: 4px; }
          .info-list { font-size: 13px; color: #cbd5e1; line-height: 1.8; margin: 20px 0; }
          .button { display: inline-block; background: #d6127e; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-top: 16px; }
          .footer { margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; font-size: 11px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Al-Ihsan International Islamic School</span>
            <h1 class="title">Admission Application Received</h1>
            <p style="margin: 0; font-size: 13px; color: #94a3b8;">Maiduguri, Borno State</p>
          </div>

          <p style="font-size: 14px; color: #e2e8f0;">Assalamu Alaikum <strong>${applicantName}</strong>,</p>
          <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">
            We have successfully received the admission application for <strong>${studentName}</strong>. Our admissions committee is reviewing the submitted records.
          </p>

          <div class="ref-box">
            <div class="ref-title">Application Reference Number</div>
            <div class="ref-number">${referenceNumber}</div>
          </div>

          <div class="info-list">
            <strong>Campus:</strong> ${campusName}<br />
            <strong>Learning Track:</strong> ${track.toUpperCase()}<br />
            <strong>Status:</strong> Submitted & Under Review
          </div>

          <p style="font-size: 13px; color: #cbd5e1;">
            You can track your application status, view review notes, or update documents directly via your portal.
          </p>

          <a href="${portalUrl}" class="button">Access Applicant Portal</a>

          <div class="footer">
            © ${new Date().getFullYear()} Al-Ihsan International Islamic School · Maiduguri, Borno State, Nigeria.<br />
            For inquiries, email admissions@alihsan.sch.ng
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({
    to: toEmail,
    subject: `Application Received: ${studentName} (${referenceNumber}) — Al-Ihsan`,
    html,
  });
}

// 2. Admission Status Update Notification Email
export async function sendAdmissionStatusUpdateEmail({
  toEmail,
  studentName,
  referenceNumber,
  newStatus,
  publicMessage,
}: {
  toEmail: string;
  studentName: string;
  referenceNumber: string;
  newStatus: string;
  publicMessage: string;
}) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/portal`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A0E14; color: #f8fafc; margin: 0; padding: 40px 20px; }
          .container { max-width: 580px; margin: 0 auto; background: #121824; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; }
          .header { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 24px; }
          .badge { display: inline-block; background: rgba(201,160,99,0.15); color: #c9a063; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
          .title { font-size: 22px; font-weight: 700; color: #ffffff; margin: 12px 0 4px 0; }
          .status-box { background: rgba(28,127,193,0.1); border: 1px solid rgba(28,127,193,0.3); border-radius: 12px; padding: 16px; margin: 20px 0; }
          .button { display: inline-block; background: #d6127e; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-top: 16px; }
          .footer { margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; font-size: 11px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Application Status Update</span>
            <h1 class="title">Update on ${studentName}</h1>
            <p style="margin: 0; font-size: 13px; color: #94a3b8;">Ref: ${referenceNumber}</p>
          </div>

          <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">
            An update has been posted to your admission application for <strong>${studentName}</strong>:
          </p>

          <div class="status-box">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #1c7fc1;">
              New Status: ${newStatus.replace("_", " ").toUpperCase()}
            </div>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #e2e8f0; line-height: 1.5;">
              ${publicMessage}
            </p>
          </div>

          <a href="${portalUrl}" class="button">View Application on Portal</a>

          <div class="footer">
            © ${new Date().getFullYear()} Al-Ihsan International Islamic School · Maiduguri, Borno State, Nigeria.
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({
    to: toEmail,
    subject: `Status Update: ${studentName} (${referenceNumber}) — Al-Ihsan`,
    html,
  });
}
