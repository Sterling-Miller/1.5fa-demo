import { getUser } from "../../db"; // Use existing db.ts functions
import { compareSync, hashSync, genSaltSync } from "bcrypt-ts";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing email or password" }), { status: 400 });
  }

  
  const user = await getUser(email) as { id: number; email: string; password: string }[];


  if (!user || user.length === 0) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 401 });
  }

 
  const validPassword = compareSync(password, user[0].password);


  if (!validPassword) {
    return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });
  }

 
  return new Response(JSON.stringify({ message: "Login successful" }), { status: 200 });
}
