const router = require('express').Router()
const db = require("../models")
//Require bcrypt for user password hashing
const bcrypt = require('bcrypt')

const { User } = db

router.post('/', async (req, res) => {
    // ASYNC request for password to be hashed and added to password_digest column
    let { password, ...rest } = req.body;
    const user = await User.create({
        ...rest,
        passwordDigest: await bcrypt.hash(password, 10)
    })
    res.json(user)
})


router.get('/', async (req, res) => {
    const users = await User.findAll()
    res.json(users)
})

module.exports = router