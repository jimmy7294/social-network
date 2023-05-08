// api for sending a user credentials received after successful registration using Next.js that send a post request to the backend written in go to create a new user

// api for sending a user credentials received after successful registration using Next.js that send a post request to the backend written in go to create a new user
// Path: frontend/src/pages/api/register.js
// Compare this snippet from frontend/src/pages/index.js:
// // import { redirect } from "next/dist/server/api-utils";
// // import Link from "next/link";
// // import { useEffect, useState } from "react";
// import Cookies from 'js-cookie'
// import { useRouter } from 'next/router';
//
// function MyComponent() {
//   const router = useRouter();
//   if (typeof window !== 'undefined') {
//     if (Cookies.get('myCookie') !== undefined) {
//       // The cookie exists, do something
//       return(
//         <h2>Hello</h2>
//       )
//     } else {
//       router.push('/entry/login');
//     }
//   }
//
