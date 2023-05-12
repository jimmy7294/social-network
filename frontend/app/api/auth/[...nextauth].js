import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
export default NextAuth({
    providers: [
        // using credentials provider
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const res = await fetch("/your/endpoint", {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })
                const user = await res.json()
                // Any object returned will be saved in `user` property of the JWT
                return user
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error', // Error code passed in query string as ?error=
        verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: null // If set, new users will be directed here on first sign in
    },
    events: {
        signIn: async (message) => { /* on successful sign in */ },
        signOut: async (message) => { /* on signout */ },
        createUser: async (message) => { /* user created */ },
        linkAccount: async (message) => { /* account linked to a user */ },
        session: async (message) => { /* session is active */ },
        error: async (message) => { /* error in authentication flow */ }
    },
    callbacks: {
        signIn: async (user, account, profile) => {
            return Promise.resolve(true)
        }
    },
    debug: false
})
