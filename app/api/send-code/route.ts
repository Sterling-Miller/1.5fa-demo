// app/api/send-code/route.ts
import { verificationCodes } from '../verificationCodes'; // Import shared map
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    // Generate a 6-digit verification code
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the verification code with expiration (15 minutes)
    verificationCodes.set(email, { code: token, expiresAt: Date.now() + 15 * 60 * 1000 });

    console.log(`Code saved for ${email}: ${token}`);

    // Send the verification code to the user's email using Resend
    // const response = await resend.emails.send({
    //   from: "onboarding@resend.dev", // Replace with your domain
    //   to: email,
    //   subject: "Verify Your Email",
    //   html: `<p>Your verification code is: <strong>${token}</strong></p>`,
    // });

    // Modified code to use custom domain:
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Leo <auth@uocsdev.xyz>',
        to: [email],
        subject: 'Your 2FA Code',
        html: `<p>Your verification code is: <strong>${token}</strong></p>`,
      }),
    });
  
    if (response.ok) {
      console.log('Email sent successfully');
      const data = await response.json();
      return Response.json(data);
    }

    // Cleanup this part below?
    return new Response(JSON.stringify({ success: true, response }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "unknown error" }), { status: 500 });
  }
}
