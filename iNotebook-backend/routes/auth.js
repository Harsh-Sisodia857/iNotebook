const express = require('express')
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "HarshWantsToBeWebDeveloper";

// Creating a user using : POST "/api/auth/createuser"
router.post('/createuser', [
    body('name', "Enter a valid Name").isLength({ min: 5 }),
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Password must be atleast 5 character").isLength({ min: 5 })
], async (req, res) => {
    // if there are error return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // check whether the user with same email exists already or not
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry user with this email already exists" })
        }
        // implementing bcrypt js
        // bcrypt.hash and bcrypt.genSalt returns promise
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        });
        const data = {
            user: {
                id: user.id
            }
        }
        // implementing jsonwebtoken npm package which helps to validate authentic user
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken })
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Some error occured")
    }
})

module.exports = router;