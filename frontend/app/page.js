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
import Profile from "./components/Profile"
import Link from "next/link"

const HomePage = () => {
  return (
    <div>
      <h1>Meow meow meow</h1>
      <Profile />
    </div>
  )
}

export default HomePage      