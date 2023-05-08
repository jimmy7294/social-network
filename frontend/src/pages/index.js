// import { headers } from "next/dist/client/components/headers";
// import { redirect } from "next/dist/server/api-utils";
// import Link from "next/link";
// import { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import { useRouter } from 'next/router';

function MyComponent() {
  const router = useRouter();
  if (typeof window !== 'undefined') {
    if (Cookies.get('myCookie') !== undefined) {
      // The cookie exists, do something
      return(
        <h2>Hello</h2>
      )
    } else {
      router.push('/entry/login');
    }
  }


}



// function Chat(){
//     return()
// }

// function Posts(){
//     // should be getting all posts
//     const [posts, SetPosts] = useState([])
//     useEffect(() => {
//         const fetchPosts = async () => {
//           const res = await fetch('/getallposts');
//           const data = await res.json();
//           setPosts(data);
//         };
      
//         fetchPosts();
//       }, []);
// return()
// }
    

//     return()
// }

// function Following(){
//     return()
// }

// function SearchBar(){g
// return()
// }

// function MakePost(){
//     return()
// }

// function Profile(){
//     return()
// }

// function CommonChat(){
//     return()
// }
// function Notifications(){
//     return()
// }




export default function Home() {
  MyComponent()
return(<h1>moo</h1>)
}