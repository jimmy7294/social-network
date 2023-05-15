// import { AuthRequiredError } from '../app/lib/exceptions'

// const session = null;
// export default function HomePage() {
//   if (!session) throw new AuthRequiredError();
//   return (
//     <div className="container">
//       <main>
//         <h1 className="title">
//           This is the home page that only logged in users can see
//         </h1>
//       </main>
//     </div>
//   );
// }

import Link from "next/link"

const HomePage = () => {
  return (
    <div>
      <h1>Meow meow</h1>
      <ul>
        <li><Link href='/'>Meow Home</Link></li>
        <li><Link href='/profile'>Meow Profile</Link></li>
        <li><Link href='/profile/group'>Meow Group</Link></li>
      </ul>
    </div>
  )
}

export default HomePage      