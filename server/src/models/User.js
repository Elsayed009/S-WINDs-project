const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        uinque: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'fleet_manager'],
        default: 'user',
    }, 
    vehicleType: {
        type: String,
        enum: ['car', 'motorcycle', 'truck'],
        default: 'car',
    },
    // refreshToken:{
    //     type: String,
    //     default: null,
    // },
    refreshToken: {
        token: {type: String, default: null},
        createdAt: {type: Date, default: null},
        expiresAt: {type: Date, default: null},
        deviceFingerprint: {type: String, default: null},
        lastIP: {type: String, default: null},
    },
}, {timestamps: true});

//save hashed password
userSchema.pre('save',async function(next){
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// compaire method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
