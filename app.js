const express = require('express');
const bcrypt = require('bcrypt');
const catchAsync = require("./catchAsync.js");

const User = require('./userModel.js');
const UserController = require("./userController.js");
const app = express();

app.use(express.json());

app.get("/", UserController.main);
app.get('/users', UserController.main);

app.post('/users', catchAsync(async (req, res, next) => {
        let exists = await User.findOne({login: req.body.login});
        if(exists !== null){
            return res.status(500).json({"Error": "User with such login already exists"})
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let created = await User.create(
            { 
            firstName: req.body.firstName, 
            lastName: req.body.lastName,
            login: req.body.login,
            password: hashedPassword
         });
        
        res.status(201).json({"Msg": "User registered", "User": created})
   
  }));

app.post("/users/login", (req, res, next) => {

    const errorList = [];

    if(req.body.login === undefined){
        errorList.push({"login": "You must send login!"});
    };
    if(req.body.login === ""){
        errorList.push({"login": "Login cannot be empty!"});
    };
    if(req.body.password === undefined){
        errorList.push({"password": "You must send password"});
    };
    if(req.body.password === ""){
        errorList.push({"password": "Password cannot be empty!"});
    };
   
    if(errorList.length > 0){
        return res.status(400).json({"Error": errorList});
    }
    return next();
});
app.post('/users/login', catchAsync(async (req, res, next) => {
  
  let user = await User.findOne({login: req.body.login});
    if(user === null){
        return res.status(400).json({"Error": "Cannot find user"})
    }

  if(await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Not Allowed')
    }
}));

app.use((err, req, res, next) => {
    res.status(500).json({"Error": "Some kind of error occurred."});
});

module.exports = app;