const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Remove extra spaces
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Store email in lowercase
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Middleware: Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && !this.password.startsWith('$2')) { // Avoid rehashing
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare input password with hashed password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
