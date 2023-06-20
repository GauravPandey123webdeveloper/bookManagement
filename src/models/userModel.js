const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "please Enter title like Mr. Mrs. Miss"],
        enum: ['Mr', 'Mrs', 'Miss']
    },
    name: {
        type: String,
        trim: true,
        required: [true, "please Enter the name "]
    },
    phone: {
        type: String,
        required: [true, "please Enter the mobile number"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "please Enter the email Id"],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: [true, "please Enter the password"],
        minLength: 8,
        maxLength: 15
    },
    address: {
        street: {
            trim: true,
            type: String
        },
        city: {
            trim: true,
            type: String
        },
        pincode: {
            type: String,
            trim: true
        }
    }
}, { timestamps: true }
)
module.exports = mongoose.model("UserCollection", userSchema)