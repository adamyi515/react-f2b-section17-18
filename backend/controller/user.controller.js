const User = require('../models/user.model');
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs');

// @desc   Allow people to register as user.
// @route  /api/users
// @access PUBLIC
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validation rules whether they have submitted a request with the required parameters.
    if(!name || !email || !password){
        res.status(400).json({
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
        const user = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = await User.create(user);
        return res.status(201).json(newUser);

    } catch (error) {
        res.status(400);
    }

});


const loginUser = async (req, res) => {
    res.send('Login user.')
}


module.exports = {
    registerUser,
    loginUser
}