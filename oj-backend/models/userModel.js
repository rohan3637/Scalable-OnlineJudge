const mongoose = require("mongoose");

const userRoles = {
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_USER: 'ROLE_USER'
};

const userSchema = new mongoose.Schema({
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
    role: {
        type: String,
        enum: [userRoles.ROLE_ADMIN, userRoles.ROLE_USER],
        default: userRoles.ROLE_USER 
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;