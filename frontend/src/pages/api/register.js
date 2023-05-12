// import { data } from "autoprefixer";
// import { NextApiRequest, NextApiResponse } from "next";
// import Cookies from 'js-cookie'

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
    const { email, password, firstName, lastName, birthDate } = req.body;

    // CONNECT TO DATABASE AND CHECK IF USER EXISTS or NOT and then add user to database

    // at the moment, only return a dummy response
    const response = {
      status: "success",
      message: "User registered successfully",
      data: {
        email,
        password,
        firstName,
        lastName,
        birthDate,
      },
    };
    res.status(200).json(response);
  } else {
    // Handle any other HTTP method
    res.status(200).json({ name: "John Doe" });
  }
}
