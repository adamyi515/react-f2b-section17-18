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

        // Check password is correct.
        if(foundUser && await bcrypt.compare(password, foundUser.password)){
            return res.status(200).json(foundUser)
        }
        


    } catch (error) {
        return res.status(400).json({
            error: 'Invalid user credentials.'
        })
    }   

}


module.exports = {
    registerUser,
    loginUser
}