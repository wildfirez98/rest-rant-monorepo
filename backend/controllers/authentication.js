const router = require('express').Router() // Require Express router
const db = require("../models") // db variable to access models for our database
const bcrypt = require('bcrypt') // Require bcrypt for authenticating password hashes

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
        req.session.userId = user.userId
        res.json({user})
    }

    console.log(user)
})

// Request handler to the authentication controller. Goal is to return currently logged-in user.
router.get('/profile', async (req, res) => {
    console.log(req.session.userId)
    try {
        let user = await User.findOne({
            where: {
                userId: req.session.userId
            }
        })
        res.json(user)
    } catch {
        res.json(null)
    }
})

// Samesite cookies test route
router.post('/super-important-route', async (req, res) => {
    if(req.session.userId) {
        console.log('Do the really super important thing!')
        res.send('Done')
    } else {
        console.log('You Shall Not Pass 🧙‍♂️!')
        res.send('Denied')
    }
})


module.exports = router
