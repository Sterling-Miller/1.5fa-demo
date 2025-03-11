import { verificationCodes } from '../verificationCodes'; // Import shared map

export async function POST(req: Request) {
  const { email, code } = await req.json();
  
  if (!email || !code) {
    return new Response(JSON.stringify({ error: "Email and code are required" }), { status: 400 });
  }

  console.log(`Looking up code for ${email}`);

  const storedData = verificationCodes.get(email);

  if (!storedData) {
    console.log(`No verification code found for ${email}`);
    return new Response(JSON.stringify({ error: "No verification code found for this email" }), { status: 404 });
  }

  console.log(`Found code for ${email}: ${storedData.code}`);

  if (Date.now() > storedData.expiresAt) {
    verificationCodes.delete(email);
    return new Response(JSON.stringify({ error: "Verification code expired" }), { status: 410 });
  }

  if (storedData.code === code) {
    verificationCodes.delete(email); // Remove code after successful verification
    return new Response(JSON.stringify({ message: "Code verified successfully" }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: "Invalid verification code" }), { status: 401 });
  }
}
