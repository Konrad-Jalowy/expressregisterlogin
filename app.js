const express = require('express');
const { body } = require('express-validator');
const {validationResult} = require('express-validator')
const UserController = require("./userController.js");
const app = express();

const loginValidator = [
    body('login', 'Login cannot be empty').not().isEmpty(),
    body('password', 'Password cannot be empty').not().isEmpty(),
    body('password', 'The minimum password length is longer').isLength({min: 3}),
    body('login', 'The minimum login length is 6 characters').isLength({min: 6}),
  ]

app.use(express.json());

app.get("/", UserController.main);
app.get('/users', UserController.main);

app.post('/users', UserController.registerValidator);
app.post('/users', UserController.register);

// app.post("/users/login", UserController.loginValidator);
app.post("/users/login", loginValidator, (req, res, next) => {
    const errors = validationResult(req)
  if (errors.isEmpty()) {
    
    return next();
  }
 return res.status(422).json({errors: errors.array()})
})
app.post('/users/login', UserController.login);

app.use(UserController.errorHandler);

module.exports = app;