import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import { LoginSchema } from "@/types/Schema";
import { createHmac } from "crypto";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client";
import db from "./lib/db";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [GitHub, Credentials({
    type: "credentials",
    name: "email",
    credentials: {
      email: { label: "email", type: "text", placeholder: "something@gmail.com" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials, req){
      const { email, password } = credentials;
      
      const validateForm = LoginSchema.safeParse({
        email: email,
        password: password
      })

      if (!validateForm.success) {
        throw new Error(`Email is not valid!`)
      }

      if (!email || !password) return null;

    const hash = createHmac('sha256', process.env.SECRET!).update((password as string)).digest('hex');

      const user = await db.user.findUnique({
        where: { email: (email as string) },
      });


      if (user === null) {
        return null;
      }

      const authUser = email === user.email && hash == user.password;

      if (!authUser) {
        return null;
      } else {

       return {
        id: user.id,
        email: user.email,
        name: user.name,
       };
      }
    },
  })],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn:"/auth"
  },
  session: {
    strategy: "jwt",
  }, callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      return url
    },
    async session({ session, user, token,trigger }) {
      if (token.phone) {
        session.user.email = token.email,
        session.user.name = token.name,
        session.user.id = token.sub as string
      }
      return session
    },
    async jwt({ token, user, account , session, profile, isNewUser, trigger }) {
      
      if (trigger === "update" && session.isEmailVerified ) {
        token.isEmailVerified = session.isEmailVerified;
      }
      
      if (trigger === "update" && session.phoneVerified ) {
        token.phoneVerified = session.phoneVerified;
      }
      
      if (trigger === "update" && session.verified ) {
        token.isVerified = session.verified;
      }
      
      if (trigger === "update" ) {
        token.avatar = session.avatar;
      }

      if (user) {
        token.email = user.email as string
        token.name = user.name as string,
        token.id = user.id as string
      }
      return token
    }
  }})