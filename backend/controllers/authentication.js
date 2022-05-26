const router = require('express').Router() // Require Express router
const db = require("../models") // db variable to access models for our database
const bcrypt = require('bcrypt') // Require bcrypt for authenticating password hashes
const jwt = require('json-web-token') // Require json-web-token 

const { User } = db // Destructured User expression so we can extract specific data from our users table thru 'db'

router.post('/', async (req, res) => {
    
    // Finding a user by email that they entered in the form
    let user = await User.findOne({
        where: { email: req.body.email }
    })
    // Compare the password we collected from the frontend with passwordDigest in backend using bcrypt 
    if(!user || !await bcrypt.compare(req.body.password, user.passwordDigest)) {
        res.status(404).json({
            message: `Could not find a user with the provided username and password`
        })
    } else {
        const result = await jwt.encode(process.env.JWT_SECRET, { id: user.userId })
        res.json({ user: user, token: result.value }) // Respond to the frontend with both the authenticated user and the JWT we created
    }

    console.log(user)
})

router.get('/profile', async (req, res) => {
    try {
        // Split the authorization header into [ "Bearer", "TOKEN"]:
        const [authenticationMethod, token] = req.headers.authorization.split(' ')

        // Only handle "Bearer" authorization for now
        // (we could add other authorization strategies later):
        if (authenticationMethod == 'Bearer') {

            // Decode the JWT
            const result = await jwt.decode(process.env.JWT_SECRET, token)

            // Get the logged in user's id from the payload
            const { id } = result.value // Destructured variable to remove only the id from the result
        
        let user = await User.findOne({
            where: {
                userId: id  
            }
        })
        res.json(user)
        }
    } catch {
        res.json(null)
    }
})



module.exports = router
