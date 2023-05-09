// import { headers } from "next/dist/client/components/headers";
// import { redirect } from "next/dist/server/api-utils";
// import Link from "next/link";
// import { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import { useRouter } from 'next/router';
import { headers } from "next/dist/client/components/headers";
import { useState } from "react";

// function to build Registration
function RegistrationComp(){




  //build inside of return <>
return(
  <>
      <div>
        <h2>FUCKING NAME IT </h2>
      </div>
      <div>
        <h2>mooo</h2>
      </div>
      </>
)
}


// function to build Login window
function LoginComp(){
  //updates form values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
//makes sure that the submuit it not empty/sends a fetch to see if username/password is correct
  const HandleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/loginvalidation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email,password}),
    });

    if (res.ok) {
      // Handle success
    } else {
      router.push('/entry/login');
    }
  };
  // takes the new changes in the form and updates the formdata
  const HandleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //login component/design
  return(
    <>
    <div>
      <h2>Something</h2>
    </div>
    </>
  )
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