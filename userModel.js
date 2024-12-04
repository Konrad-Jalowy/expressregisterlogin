const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  
}, {timestamps: true, 
  toJSON: {virtuals: true}, 
  toObject: {virtuals: true}
 });

userSchema.virtual('fullname').get(function() {
  return this.firstName + " " + this.lastName;
});


module.exports = mongoose.model('User', userSchema);