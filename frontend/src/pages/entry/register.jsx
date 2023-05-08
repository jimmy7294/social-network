import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault()
        // const response = await fetch("http://localhost:3000/api/register", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ email, password }),
        // })
        // const data = await response.json()
        // console.log("Register data:", data)

        // no backend code yet, so we'll just hardcode the response
        const data = { success: true }
        // Navigate to the login page after successful registration
        if (data.success) {
            router.push("/entry/login")
        }
    };

    return (
        <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="https://imgpile.com/images/9NDeGC.jpg"
              alt="Your Company"
            />
            <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Irelevant Discussions</h1>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Register
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
            { /*Email*/}
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              { /*First Name*/}
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                    First Name
                  </label>
                  <div className="text-sm">
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="firstName"
                    name="firstName"
                    type="firstName"
                    required
                    className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              { /* Last Name */}
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                    Last Name
                  </label>
                  <div className="text-sm">
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="lastName"
                    name="lastName"
                    type="lastName"
                    required
                    className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              { /* Birth Date */}
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="birthDate" className="block text-sm font-medium leading-6 text-gray-900">
                    Date of Birth
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="birthDate"
                    required
                    className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              { /* Password */}
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              { /* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Register
                </button>
              </div>
            </form>
      
            <p className="mt-10 text-center text-sm text-gray-500">
              Already a user?{' '}
              <Link href="/entry/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Login here
              </Link>
            </p>
          </div>
        </div>
      </>
    )
  }
  