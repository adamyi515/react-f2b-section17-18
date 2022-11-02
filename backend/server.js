const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;
const dotenv = require('dotenv').config();
const connect = require('./config/db');

// ROUTES
const userRoutes = require('./routes/user.routes');

/////////////////////////////////////////////////////////////////////////
// DB CONNECTION
connect();


/////////////////////////////////////////////////////////////////////////
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }))






// ENDPOINTS //////////////////////////////////////////////////////
app.use('/api/users', userRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});