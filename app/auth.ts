import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { getUser, markTokenAsUsed, getTokenData } from "app/db";
import { authConfig } from "app/auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    // This is our method of authenticating with email and password
    Credentials({
      id: "credentials",
      async authorize({ email, password }: any) {
        let user = await getUser(email);
        if (user.length === 0) return null;
        let passwordsMatch = await compare(password, user[0].password!);
        if (passwordsMatch) return user[0] as any;
      },
    }),
    // This is our method of authenticating with a QR code
    Credentials({
      id: "qr-token",
      async authorize({ ephemeralToken }: any) {
        if (!ephemeralToken) return null;

        const tokenDataArray = await getTokenData(ephemeralToken);
        const tokenData = tokenDataArray[0];

        if (!tokenData || tokenData.used || !tokenData.expiresat || tokenData.expiresat < new Date()) return null;

        const tokenUserEmail = tokenData.useremail;
        if (!tokenUserEmail) return null;

        let user = await getUser(tokenUserEmail);
        if (!user) return null;

        await markTokenAsUsed(ephemeralToken);

        return user[0] as any;
      },
    }),
  ],
});
