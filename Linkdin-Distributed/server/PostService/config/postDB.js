const mongoose = require('mongoose');
require('dotenv').config();

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, MONGO_DATABASE_NAME } = require("./environments");
const DATABASE_URL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/${MONGO_DATABASE_NAME}?authSource=admin`



const connectDB = () => {

    mongoose
        .connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log(`Database Connected`))
        .catch((error) => {
            console.log(error);
            setTimeout(connectDB, 1000)
        })

}

module.exports = connectDB;