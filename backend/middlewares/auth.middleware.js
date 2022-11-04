const jwt = require('jsonwebtoken');
const User = require('../models/user.model');


const protectRoute = async (req, res, next) => {
    let token;

    // Check to see if the request from client side has 'authorization' property attached to request's header.
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        try {
            // Grab the token value from the header's "authorization" property.
            token = req.headers.authorization.split(' ')[1];

            // Verify that the token passed to the endpoint. If verified, decode it.
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
            const { id } = decoded;

            // Make a query to MongoDB and grab the user with the correct id.
            const foundUser = await User.findById(id).select('-password');
            
            // Once it finds the User, create a new property called "user" and attach it to the request object.
            req.user = foundUser;

            next();
        } catch (error) {
            res.status(401).json({
                error: error
            })
        }
        
    } else {
        res.status(401).json({
            error: 'Not authorized.'
        })
    }
   
    
}


module.exports = {
    protectRoute
};