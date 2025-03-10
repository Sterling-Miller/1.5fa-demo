import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { getUser, getEmailFromToken, markTokenAsUsed } from "app/db";
import { authConfig } from "app/auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "credentials",
      async authorize({ email, password }: any) {
        let user = await getUser(email);
        if (user.length === 0) return null;
        let passwordsMatch = await compare(password, user[0].password!);
        if (passwordsMatch) return user[0] as any;
      },
    }),

    Credentials({
      id: "qr-token",
      async authorize({ ephemeralToken }: any) {
        if (!ephemeralToken) return null;

        // Look up which code record has this ephemeralToken
        const tokenUserEmail = await getEmailFromToken(ephemeralToken);

        // If no record found or email does not match, return null
        if (!tokenUserEmail) return null;

        let user = await getUser(tokenUserEmail);
        if (!user) return null;

        // Mark token as used
        await markTokenAsUsed(ephemeralToken);

        // Return the user object if the token is valid
        return user[0] as any;
      },
    }),
  ],
});
