// Import mongoose
const mongoose = require("mongoose");

// Create User Schema
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

// Create User Model
const User = mongoose.model("User", userSchema);

// Export the model
module.exports = User;
