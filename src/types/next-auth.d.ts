import NextAuth, { DefaultUser } from "next-auth"
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface Session extends DefaultSession {
    user: {
      email: string;
      name: string;
      id: string;
    }
  }

  interface User extends DefaultUser {
    email: string;
    name: string;
    id: string;
  }

declare module "@auth/core/adapters" {
    interface AdapterUser {
      // Add your additional properties here:
      email: string;
      name: string;
      id: string;
    }
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    user: {
      email: string;
      name: string;
      id: string;
    }
  }
}
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    email: string;
    name: string;
    id: string;
  }
}