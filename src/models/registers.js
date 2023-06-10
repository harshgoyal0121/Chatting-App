const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const {Schema} = mongoose

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  data: {
    type: String,
  },
  friend: [
    {
      friend_name: String,
      friend_phone: {
        type: Number,
        unique: true,
      },
      friend_email: {
        type: String,
        unique: true,
      }
    }
  ],
});

//creating collection
const Register = new mongoose.model("Register", userSchema);
module.exports = Register;
