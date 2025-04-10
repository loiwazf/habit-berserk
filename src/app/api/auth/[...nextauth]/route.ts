import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET) {
  console.warn('Google OAuth credentials are not configured')
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback:', { user, account, profile })
      return true
    },
    async session({ session, token, user }) {
      console.log('Session callback:', { session, token, user })
      if (session.user && session.user.email) {
        // Use the email as a unique identifier since it's guaranteed to be unique
        session.user.id = session.user.email
        console.log('Set user ID in session:', session.user.id)
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      console.log('JWT callback:', { token, user, account, profile })
      if (user && user.email) {
        token.sub = user.email
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: true,
})

export { handler as GET, handler as POST } 