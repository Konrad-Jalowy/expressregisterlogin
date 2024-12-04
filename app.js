const express = require('express');
const bcrypt = require('bcrypt');
const catchAsync = require("./catchAsync.js");

const User = require('./userModel.js');
const UserController = require("./userController.js");
const app = express();

app.use(express.json());

app.get("/", UserController.main);
app.get('/users', UserController.main);

app.post('/users', UserController.register);

app.post("/users/login", UserController.loginValidator);
app.post('/users/login', UserController.login);

app.use(UserController.errorHandler);

module.exports = app;