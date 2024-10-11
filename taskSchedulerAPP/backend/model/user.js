// models/User.js
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
 tasks: [
    {
      type: {
        type: String,
        default: "No Task"
      },
      time: {
        type: Date
      }
    }
  ]
})

module.exports = mongoose.model('User', UserSchema)
