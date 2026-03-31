const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // We store these so the user doesn't have to select them every time
    university: { type: String, default: "Nagpur" }, 
    branch: { type: String, default: "ETC" },
    semester: { type: String, default: "" }, 
    role: { type: String, default: "student" } // To identify you as the curator
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);