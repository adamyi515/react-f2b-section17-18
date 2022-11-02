const mongoose = require('mongoose');
const dbUrl = process.env.MONGO_URI;

const connect = async () => {
    try {
        await mongoose.connect(dbUrl)
        console.log(`MongoDB connected`)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
    
}

module.exports = connect;