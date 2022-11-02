const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;

// ROUTES
const userRoutes = require('./routes/user.routes');

// ROUTES
app.use('/api/users', userRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});