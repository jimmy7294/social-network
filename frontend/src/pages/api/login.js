
export default async function handlerLogin(req, res) {
    if (req.method === "POST") {
        // Process a POST request
        const {email, password} = req.body;

        // CHECK if user exists in database
        //...
        // CHECK if the password is correct
        //...
        // if user exists and password is correct, then return a success response
        const response = {
            status: 'success',
            message: 'User logged in successfully',
            data: {
                email,
                password,
            },
        };
<<<<<<< HEAD
        
        // set cookie to remember user is logged in and redirect to home page

        res.status(200).json(response)  

        
=======
        console.log("response: ", response)
        res.status(200).json(response);
>>>>>>> 84cc78f (main page navigation)
    } else {
        // Handle any other HTTP method
        res.status(200).json({ name: 'John Doe' })
    }
}

