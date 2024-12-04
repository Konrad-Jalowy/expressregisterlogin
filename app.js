const express = require('express');

const UserController = require("./userController.js");
const app = express();

app.use(express.json());

app.get("/", UserController.main);
app.get('/users', UserController.main);

app.post('/users', UserController.registerValidator);
app.post('/users', UserController.register);

app.post("/users/login", UserController.loginValidator);
app.post('/users/login', UserController.login);

app.use(UserController.errorHandler);

module.exports = app;