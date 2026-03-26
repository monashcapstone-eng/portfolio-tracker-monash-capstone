import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"NexaFlow Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <h2 style="margin-bottom:4px">New Contact Form Submission</h2>
          <p style="color:#64748b;font-size:14px;margin-top:0">Received via NexaFlow Portfolio Tracker</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0"/>
          <table style="width:100%;font-size:14px;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0;color:#64748b;width:80px">Name</td>
              <td style="padding:8px 0;font-weight:600;color:#0f172a">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#64748b">Email</td>
              <td style="padding:8px 0;font-weight:600;color:#0f172a">${email}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#64748b">Subject</td>
              <td style="padding:8px 0;font-weight:600;color:#0f172a">${subject}</td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0"/>
          <p style="font-size:14px;color:#64748b;margin-bottom:4px">Message</p>
          <p style="font-size:14px;color:#0f172a;white-space:pre-wrap;background:#f8fafc;border-radius:8px;padding:12px">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
