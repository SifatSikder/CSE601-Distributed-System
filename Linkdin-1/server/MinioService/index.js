//App creation
const express = require("express");
const app = express();

//port setup
const port = process.env.PORT || 7000;

//body parser configutation
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(bodyParser.json({ limit: "50mb" }))

//cors setup
const cors = require("cors");
app.use(cors())


//Routes configuration
const storageRoutes = require('./routes/storage');
app.use('/api/objectStorage', storageRoutes);


//server listens here
app.listen(port, () => { console.log(`server is runing at port ${port}`) }) 