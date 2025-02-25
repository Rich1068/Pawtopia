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
    profileImage: {
        type: String, 
    },
    phoneNumber: {
        type: String,
        require: true,
        validate: {
            validator: function (v: string) {
                return /^\d{11}$/.test(v);
            },
            message: "Invalid phone number format"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true })

export default mongoose.model('User', userSchema)