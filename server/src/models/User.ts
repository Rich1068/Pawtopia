import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String, 
        enum: ['admin', 'user'],
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('User', userSchema)