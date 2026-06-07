import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// NextAuthOptions is the TypeScript type for the config object.
// Declaring it separately (not inline) makes it reusable —
// you can import authOptions anywhere you need the session.
export const authOptions: NextAuthOptions = {
  
  // session.strategy tells NextAuth HOW to store sessions.
  // "jwt" means: store session data in a signed token in the cookie.
  // The alternative is "database" which stores sessions in a DB table.
  // We use jwt because it's simpler — no extra table needed.
  session: {
    strategy: "jwt",
  },

  // pages lets you override where NextAuth sends users.
  // Without this, it uses its own default signin page (ugly).
  // With this, it sends users to YOUR custom page.
  pages: {
    signIn: "/login",
  },

  // providers is the array of login methods you support.
  providers: [
    CredentialsProvider({
      // "name" is just a label, not used in code logic
      name: "credentials",

      // "credentials" defines what fields the login form sends.
      // NextAuth uses this for its built-in form (we'll replace
      // it with our own form, but this still needs to be here).
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // authorize() is the function NextAuth calls when a user
      // tries to log in. Return the user object if valid,
      // return null if invalid.
      
      async authorize(credentials) {
        
        // Guard: if no email or password was sent, reject
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Look up the user in the database by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        // If no user found with that email, reject
        if (!user || !user.password) {
          return null
        }

        // bcrypt.compare checks if the plain password matches
        // the hashed password stored in the DB.
        // NEVER store plain passwords. bcrypt hashes them one-way.
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!passwordMatch) {
          return null
        }

        // Return the user data that will be stored in the token
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],

  // callbacks are functions NextAuth calls at different points
  // in the auth lifecycle. We use them to add custom data
  // (like "role") into the session, because by default
  // NextAuth only stores id, name, email.
  callbacks: {
    
    // jwt() is called when a token is created or updated.
    // "token" is what gets stored in the cookie.
    // "user" is what authorize() returned — only present on first sign in.
    async jwt({ token, user }) {
      if (user) {
        // First sign in: copy role and id from user into token
        token.role = user.role
        token.id = user.id
      }
      console.log(token);
      return token
    },

    // session() is called whenever you call getServerSession()
    // or useSession() in your app.
    // "session" is what your app code actually sees.
    // "token" is the decoded cookie data.
    async session({ session, token }) {
      if (token) {
        // Copy role and id from token into session.user
        // so your components can access session.user.role
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      console.log(session);
      return session
    },
  },
}