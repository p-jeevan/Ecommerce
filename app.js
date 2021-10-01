const express = require("express");
const mongoose = require('mongoose');
const morgan  = require('morgan');
//const bodyParser = require ('body-parser');
const cookieParser = require ('cookie-parser');

require("dotenv").config();
//import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');


//app
const app = express();

//db
mongoose
    .connect(process.env.DATABASE,{
        useNewUrlParser:true
}) .then(()=> console.log("DB connected"));

//middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());

//routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);

const port = process.env.PORT || 8000

app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
});