const express = require('express')
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "HarshWantsToBeWebDeveloper";

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', "Enter a valid Name").isLength({ min: 5 }),
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Password must be atleast 5 character").isLength({ min: 5 })
], async (req, res) => {
    // if there are error while validating then return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // else
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
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 2: Authenticate a User using: POST "/api/auth/login".
router.post('/login', [
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Password Cannot be empty").exists(),
],
    async (req, res) => {

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Destructuring, getting data from req.body
        const { email, password } = req.body;
        try {
            // finding the user using entered email
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "Please Enter valid Credentials" })
            }
            // Orignal Password vs The Password entered by the user
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                return res.status(400).json({ error: "Please login with correct credentials" });
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            res.json({ authtoken })

        }
        catch (err) {
            console.error(err.message)
            res.status(500).send("Internal Server Error")
        }
    }
)

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        // Send the user details except password
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;