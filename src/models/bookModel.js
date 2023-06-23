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
        required: [true, 'releasedAt is required'],
        validate: {
          validator: function (value) {
            // Check if value is a valid Date object
            if (!(value instanceof Date && !isNaN(value))) {
              return false;
            }
    
            // Check if the date format is "YYYY-MM-DD"
            const year = value.getFullYear().toString();
            const month = (value.getMonth() + 1).toString().padStart(2, '0');
            const day = value.getDate().toString().padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
    
            return value.toISOString().split('T')[0] === formattedDate;
          },
          message: 'Invalid date format. Date should be in the format "YYYY-MM-DD".',
        },
      }

}, { timestamps: true })
module.exports = mongoose.model('BookCollection', bookSchema)