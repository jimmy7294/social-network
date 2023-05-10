import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
  session: {
    strategy: 'jwt'},
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const {email, password} = credentials;
        const user = await fetch('http://localhost:8080/api/login', {
          method: 'POST',
          body: JSON.stringify({email, password}),
          headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json())
        .then(data => {
          if (data.status === 'error') {
            throw new Error(data.message)
          }
          return data.data
        })
        return user
      }
    })
  ]
}

export default NextAuth(authOptions);