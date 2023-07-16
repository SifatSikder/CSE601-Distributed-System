const mongoose = require('mongoose');
require('dotenv').config();


const connectDB = () => {
    try {
        const connect = mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log(`Database Connected`)

    } catch (error) {
        console.log(error);
        process.exit(1)
    }
    mongoose.set('useFindAndModify', false);
}

module.exports = connectDB;