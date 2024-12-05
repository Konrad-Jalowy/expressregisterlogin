const bcrypt = require('bcrypt');
const catchAsync = require("./catchAsync.js");
const User = require('./userModel.js');
const { body } = require('express-validator');
const {validationResult} = require('express-validator')

exports.main = catchAsync( async (req, res, next) => {
    const users = await User.find({}, {firstName: 1, lastName: 1, login: 1});
    return res.json({"users": users});
});

exports.errorHandler = (err, req, res, next) => {
    res.status(500).json({"Error": "Some kind of error occurred."});
};

exports.loginValidator =  [
    body('login', 'Login cannot be empty').not().isEmpty(),
    body('password', 'Password cannot be empty').not().isEmpty(),
    body('password', 'The minimum password length is longer').isLength({min: 3}),
    body('login', 'The minimum login length is 6 characters').isLength({min: 6}),
    body('login').custom(async value => {
        const user = await User.findOne({login: value});
        if (user === null) {
          throw new Error('User doesnt exist');
        }
      }),
  ];

exports.registerValidator = [
    body('login', 'Login cannot be empty').not().isEmpty(),
    body('password', 'Password cannot be empty').not().isEmpty(),
    body('password', 'The minimum password length is longer').isLength({min: 3}),
    body('login', 'The minimum login length is 6 characters').isLength({min: 6}),
    body('firstName', 'FirstName cannot be empty').not().isEmpty(),
    body('lastName', 'LastName cannot be empty').not().isEmpty(),
    body('firstName', 'FirstName must be string').isString(),
    body('lastName', 'LastName must be string').isString(),
    body('firstName', 'FirstName must be 6 chars or longer').isLength({min: 6}),
    body('lastName', 'LastName must be 6 chars or longer').isLength({min: 6}),
    body('login').custom(async value => {
        const user = await User.findOne({login: value});
        if (user) {
          throw new Error('Login already in use');
        }
      }),
  ];

exports.validateAndForward = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      
      return next();
    }
   return res.status(422).json({errors: errors.array()})
}
exports.login = catchAsync(async (req, res, next) => {
  
    let user = await User.findOne({login: req.body.login});
    
    if(await bcrypt.compare(req.body.password, user.password)) {
        res.send('Success')
      } else {
        res.send('Not Allowed')
      }
  });

exports.register = catchAsync(async (req, res, next) => {
    

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let created = await User.create(
        { 
        firstName: req.body.firstName, 
        lastName: req.body.lastName,
        login: req.body.login,
        password: hashedPassword
     });
    
    return res.status(201).json({"Msg": "User registered", "User": created})

});

//OLD VALIDATION...

//   exports.registerValidatorOld = (req, res, next) => {

//     const errorList = [];

//     if(req.body.login === undefined){
//         errorList.push({"login": "You must send login!"});
//     };
//     if(req.body.login === ""){
//         errorList.push({"login": "Login cannot be empty!"});
//     };
//     if(req.body.password === undefined){
//         errorList.push({"password": "You must send password"});
//     };
//     if(req.body.password === ""){
//         errorList.push({"password": "Password cannot be empty!"});
//     };
//     if(req.body.firstName === undefined){
//         errorList.push({"firstName": "You must send firstName"});
//     }
//     if(req.body.firstName === ""){
//         errorList.push({"firstName": "firstName cannot be empty!"});
//     }
//     if(req.body.lastName === undefined){
//         errorList.push({"lastName": "You must send lastName"});
//     }
//     if(req.body.lastName === ""){
//         errorList.push({"lastName": "lastName cannot be empty!"});
//     }
   
//     if(errorList.length > 0){
//         return res.status(400).json({"Error": errorList});
//     }
//     return next();
// };



// exports.loginValidator = (req, res, next) => {

//     const errorList = [];

//     if(req.body.login === undefined){
//         errorList.push({"login": "You must send login!"});
//     };
//     if(req.body.login === ""){
//         errorList.push({"login": "Login cannot be empty!"});
//     };
//     if(req.body.password === undefined){
//         errorList.push({"password": "You must send password"});
//     };
//     if(req.body.password === ""){
//         errorList.push({"password": "Password cannot be empty!"});
//     };
   
//     if(errorList.length > 0){
//         return res.status(400).json({"Error": errorList});
//     }
//     return next();
// };