import { headers } from "next/dist/client/components/headers";
import { useState } from "react";

// function to build Registration
function RegistrationComp(){

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    about: '',
    firstName: '',
    lastName: '',

  });
//makes sure that the submuit it not empty/sends a fetch to see if username/password is correct
  const HandleRegistration = async (e) => {
    e.preventDefault();

    const res = await fetch('/registrationvalidation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      // Handle success
    } else {
      // Handle error
    }
  };
  // takes the new changes in the form and updates the formdata
  const HandleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //build inside of return <>
return(
  <>
      <div>
        <h2>FUCKING NAME IT </h2>
      </div>
      <div>
        <h2>mooo</h2>a
      </div>
      </>
)
}


// function to build Login window
function LoginComp(){
  //updates form values
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
//makes sure that the submuit it not empty/sends a fetch to see if username/password is correct
  const HandleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/loginvalidation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      // Handle success
    } else {
      // Handle error
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
