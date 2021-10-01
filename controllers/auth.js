const User = require("../models/user");
const {errorHandler} = require ('../helpers/dbErrorHandler')
const jwt = require('jsonwebtoken');
const user = require("../models/user");

exports.signup = (req, res) => {
//console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err,user) => {
        if (err) {
            return res.status(400).json({status:0,message:err});
            err: errorHandler(err)
        }
            res.json(user);
    });
};

exports.signin = (req, res) => {
    //find the user on email
    const {email, password} = req.body;
    User.findOne({email},(err, user) =>{
        if (err || !user) {
            return res.status(400).json({
                error:" User doesn't exist"
            });
        }
        //if user is found, match email and password
        //create authenticate method in user model
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: 'Email and password dont match'

            });
        }
        //generate a signed token with user id and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
        //persist the token as "t" in cokkie with exipy date
        res.cookie('t', token,{expire: new Date()+ 9999})
        //return response with user and token to frontend client
        const {_id, name, role} = user
        return res.json({token, user: {_id, email, name, role}});
    });
}

exports.signout = (req,res) => {
    res.clearCookie('t');
    res.json({message:"Signout success"})
}

const expressJwt = require ('express-jwt');
exports.requireSignin = ({
    secret: process.env.JWT_SECRET,
    userProperty:"auth",
    algorithms: ["HS256"], // added later
    userProperty: "auth",
  });
