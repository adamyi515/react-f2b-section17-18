// @desc   Allow people to register as user.
// @route  /api/users
// @access PUBLIC
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validation rules whether they have submitted a request with the required parameters.
    if(!name || !email || !password){
        res.status(400).json({
            errorMessage: 'All parameters must be entered.'
        })
    } else {
        res.status(201).json({
            message: 'User has been created.'
        })
    }

    // If validation is met, check to see if the user exist with MongoDB.

}


const loginUser = async (req, res) => {
    res.send('Login user.')
}


module.exports = {
    registerUser,
    loginUser
}