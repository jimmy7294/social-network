import { useRouter } from 'next/router';
import {NextPage } from 'next';
import { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter();

  // console.log("session: ", session)
  // console.log("status: ", status)

  useEffect(() => {
    if (status === "loading") return // Do nothing while loading
    if (!session) router.push('/entry/login') // Redirect to /entry/login if not authenticated
  }, [session, status])

  if (status === "authenticated") {
    return (
      <>
        <h1>Welcome to Grit:lab anti social network!</h1>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
        {/* Your Facebook Clone main page components go here */}
      </>
    )
  }

  return (
    <div>
      Loading...
    </div>
  )
}
