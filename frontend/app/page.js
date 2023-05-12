import Image from 'next/image';
import styles from './page.module.css';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  return (
    <>
      <h1>Hello World</h1>
      <Authentication />
    </>
  );
}

function Authentication() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;
  if (session)
    return (
      <p>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </p>
    );
  return (
    <p>
      Not signed in <button onClick={() => signIn()}>Sign in</button>
    </p>
  );
}
