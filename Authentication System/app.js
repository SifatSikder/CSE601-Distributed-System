//App creation
const express = require("express");
const app = express();

//port setup
require('dotenv').config()
const port = process.env.PORT || 8080;

//body parser configutation
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cors setup
const cors = require("cors");
app.use(cors())

//database connection
const connectDB = require('./config/db')
connectDB();


const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

//server listens here
app.listen(port, () => { console.log(`server is runing at port ${port}`) }) 
