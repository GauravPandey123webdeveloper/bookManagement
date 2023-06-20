const mongoose = require('mongoose')
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "please Enter the title"],
        trim: true,
        unique: true
    },
    excerpt: {
        type: String,
        trim: true,
        required: [true, "please Enter the excerpt"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: [true, "Please enter the userId"],
        ref: 'UserCollection'
    },
    ISBN: {
        type: String,
        required: [true, "please Enter IBSN"],
        trim: true,
        unique: true
    },

    category: {
        type: String,
        required: [true, "Please enter the category"],
        trim: true
    },
    subcategory: {
        type: String,
        required: [true, "please enter the subcategory"],
        trim: true
    },
    reviews: {
        type: Number,
        default: 0,
        comment: "Holds number of reviews of this book"
    },
    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        required: [true, 'Please enter the release data'],
    }

}, { timestamps: true })
module.exports = mongoose.model('BookCollection', bookSchema)