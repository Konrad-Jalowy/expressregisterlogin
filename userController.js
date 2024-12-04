const bcrypt = require('bcrypt');
const catchAsync = require("./catchAsync.js");
const User = require('./userModel.js');

exports.main = catchAsync( async (req, res, next) => {
    const users = await User.find({}, {firstName: 1, lastName: 1, login: 1});
    return res.json({"users": users});
});