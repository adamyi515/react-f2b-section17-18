const User = require('../models/user.model');
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc   Allow people to register as user.
// @route  /api/users
// @access PUBLIC
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validation rules whether they have submitted a request with the required parameters.
    if(!name || !email || !password){
        return res.status(400).json({
            error: 'All parameters must be entered.'
        })
    } 

    try {
        // If validation is met, check to see if the user exist with MongoDB.
        const foundUser = await User.findOne({ email });
        if(foundUser){
            return res.status(400).json({
                error: 'User already exist.'
            })
        }

        // ////////////////////////////////////////////////////////////////////////////////////
        // // If user does not EXIST, then create user in MongoDB.
        // 1. Make sure to encrypt the password before saving the user in the DB.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        // 2. Create a new user.
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Return a new json without specific information that is directly stored in the db, such as password. we all generate a token and attach it to 
        // the returned json.
        return res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            token: generateToken(newUser._id)
        });

    } catch (error) {
        res.status(400);
    }

});

// @desc   Allow people to login.
// @route  /api/users/login
// @access PUBLIC
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate if user has entered all parameters.
    if(!email || !password){
        return res.status(400).json({
            error: 'All parameters must be entered.'
        })
    }

    try {
        // Make a query to DB and check if user exist.
        const foundUser = await User.findOne({ email });
        if(!foundUser){
            return res.status(400).json({
                error: 'User does not exist.'
            })
        }

        // Check password is correct and everything is successful, then return User.
        if(foundUser && await bcrypt.compare(password, foundUser.password)){
            const user = {
                id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
                token: generateToken(foundUser._id)
            }

            return res.status(200).json(user);
        }
        
        // If password does not match, then do this.
        return res.status(401).json({
            error: 'Password does not match'
        })

    } catch (error) {
        return res.status(400).json({
            error: 'Invalid user credentials.'
        })
    }   

}

// Route to test the middleware for authorization.
const getMe = (req, res) => {
    const user = req.user;
    res.send(user);
}


////////////////////////////////////////////////////////////////////////////////
// Private methods
const generateToken = (id) => {
    let token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
    return token;
}


module.exports = {
    registerUser,
    loginUser,
    getMe
}