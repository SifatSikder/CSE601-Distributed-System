//App creation
const express = require("express");
const app = express();

//port setup
//port setup
const port = process.env.PORT || 8888;

//body parser configutation
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(bodyParser.json({ limit: "50mb" }))

//cors setup
const cors = require("cors");
app.use(cors())

//database connection
const connectDB = require('./config/postDB')
connectDB();

//Routes configuration
const postRoutes = require('./routes/post');
app.use('/api/post', postRoutes);

//server listens here
app.listen(port, () => { console.log(`server is runing at port ${port}`) }) 