import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

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
  //Build inside of return <>
  return(
    <>
    <div>
      <h2>Something</h2>
    </div>
    </>
  )
}


export default function Home() {
  //dont build in here
  return (
    <>
    <div>
      <RegistrationComp/>
      </div>
      <div>
        <LoginComp/>
      </div>
      </>
  )
}
