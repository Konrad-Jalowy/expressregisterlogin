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

app.post("/users/login", UserController.loginValidator);
app.post('/users/login', UserController.login );

app.use(UserController.errorHandler);

module.exports = app;