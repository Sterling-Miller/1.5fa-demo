import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUser, getEmailFromToken } from 'app/db';
import { authConfig } from 'app/auth.config';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize({ email, password }: any) {
        let user = await getUser(email);
        if (user.length === 0) return null;
        let passwordsMatch = await compare(password, user[0].password!);
        if (passwordsMatch) return user[0] as any;
      },
    }),
    // TODO: Fix this provider and make it work
    CredentialsProvider({
      name: 'EphemeralTokenLogin',
      credentials: {
        ephemeralToken: { label: 'Ephemeral Token', type: 'text' },
      },
      async authorize(credentials, req) {
        const ephemeralToken = typeof credentials?.ephemeralToken === 'string' ? credentials.ephemeralToken.trim() : null;
        if (!ephemeralToken) return null;

        // Look up which code record has this ephemeralToken
        const tokenUserEmail = await getEmailFromToken(ephemeralToken);

        // If no record found, return null
        if (!tokenUserEmail) return null;

        let user = await getUser(tokenUserEmail);
        if (!user) return null;

        // Return the user object if the token is valid
        return user[0] as any;
      },
    }),
  ],
});
