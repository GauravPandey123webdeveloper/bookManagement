const mongoose = require('mongoose')
const reviewSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: [true, "please Enter the BookId"],
        ref: "BookCollection"
    },
    reviewedBy: {
        type: String,
        required: [true, "Please Enter the reviewer name"],
        default: 'Guest',
        value: `reviewer's name`
    },
    reviewedAt: {
        type: Date,
        required: [true, "please enter the review date"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "please give rating"]
    },
    review: {
        trim: true,
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
module.exports = mongoose.model("ReviewsCollection", reviewSchema)