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
      try {
        console.log('SignIn callback:', { user, account, profile })
        return true
      } catch (error) {
        console.error('SignIn error:', error)
        return false
      }
    },
    async session({ session, token, user }) {
      try {
        console.log('Session callback:', { session, token, user })
        if (session.user && session.user.email) {
          session.user.id = session.user.email
          console.log('Set user ID in session:', session.user.id)
        }
        return session
      } catch (error) {
        console.error('Session error:', error)
        return session
      }
    },
    async jwt({ token, user, account, profile }) {
      try {
        console.log('JWT callback:', { token, user, account, profile })
        if (user && user.email) {
          token.sub = user.email
        }
        return token
      } catch (error) {
        console.error('JWT error:', error)
        return token
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
  },
  logger: {
    error(code, metadata) {
      console.error('NextAuth error:', code, metadata)
    },
    warn(code) {
      console.warn('NextAuth warning:', code)
    },
    debug(code, metadata) {
      console.log('NextAuth debug:', code, metadata)
    }
  }
})

export { handler as GET, handler as POST } 