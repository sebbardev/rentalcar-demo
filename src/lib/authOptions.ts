import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        // DEMO MODE: Hardcoded credentials for demonstration
        // In production, you should use a proper backend authentication
        const demoUsers = [
          {
            email: "admin@car-rental.com",
            password: "admin123",
            user: {
              id: "1",
              email: "admin@car-rental.com",
              name: "Admin User",
              role: "admin",
            }
          },
          {
            email: "demo@demo.com",
            password: "demo",
            user: {
              id: "2",
              email: "demo@demo.com",
              name: "Demo User",
              role: "admin",
            }
          }
        ];

        const foundUser = demoUsers.find(
          u => u.email === credentials.email.toLowerCase() && u.password === credentials.password
        );

        if (!foundUser) {
          throw new Error("Identifiants invalides");
        }

        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
          id: foundUser.user.id,
          email: foundUser.user.email,
          name: foundUser.user.name,
          role: foundUser.user.role,
          accessToken: "demo-token-" + foundUser.user.id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

