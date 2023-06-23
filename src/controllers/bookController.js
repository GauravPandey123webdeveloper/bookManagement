const bookModel = require('../models/bookModel')
const reviewModel = require('../models/reviewModel')
const userModel = require("../models/userModel")
const validation = require('../validators/valid')
const moment  = require('moment')
const createBook = async function (req, res) {
    try {
        const data = req.body
        if (!validation.isValidObjectId(data.userId)) {
            return res.status(400).send({ status: false, message: "please enter the valid user id" })
        }
        const checkUser = await userModel.findOne({ _id: data.userId })
        if (!checkUser) {
            return res.status(404).send({ status: false, message: "User does not exist" })
        }
        if(! moment(data.releasedAt, "YYYY-MM-DD").isValid()){
            return res.status(400).json({ status: false, message: 'date is invalid' });
        }
        const book = await bookModel.create(data)
        return res.status(201).send({ staus: true, data: book })
    } catch (error) {
        if (error.message.includes('validation')) {
            return res.status(400).send({ status: false, message: error.message })
        } else if (error.message.includes('duplicate')) {
            return res.status(400).send({ status: false, message: error.message })
        } else {
            return res.status(500).send({ status: false, message: error.message })
        }
    }

}
const getAllBooks = async function (req, res) {
    try {
        //getting all the details from query params
        const userId = req.query.userId;
        const category = req.query.category;
        const subCat = req.query.subcategory;

        //if user didn't provided any query 
        if (!userId && !category && !subCat) {
            const bookData = await bookModel.find({ isDeleted: false }).select({_id:1,title:1,excerpt:1,userId:1,category:1,reviews:1,releasedAt:1})
            if (bookData.length === 0) {
                return res.status(404).send({ status: false, message: "No books are available." });
            } else {
                return res.status(200).send({ status: true, data: bookData });
            }
        }
        // if user has provided queries in query param 
        else {
            const filters = {};
            if (userId) {
                if (!validation.isValidObjectId(userId)) {
                    return res.status(404).send({ status: false, message: "please enter the valid user id" })
                }
            }
            // inserting all the entered data of query param in filter object
            if (userId) filters.userId = userId;
            if (category) filters.category = category;
            if (subCat) filters.subcategory = subCat;
            // return only those books which are not deleted 
            const bookData = await bookModel.find({ $and: [{ isDeleted: false }, filters] })
            return res.status(200).send({ status: true, data: bookData });
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err })
    }
};
const getBook = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (!validation.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "please enter the valid book id" })
        }
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean()
        if (!book) {
            return res.status(404).send({ status: false, message: "Book data is not found" })
        }
        const reviews = await reviewModel.find({ bookId: bookId }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
        book.reviewData = reviews

        return res.status(200).send({ status: true, message: "book list", data: book })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }


}
const updateBook = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (!validation.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "please enter the valid book id" })
        }
        const data = req.body
        const updatedBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: data }, { new: true })
        if (!updatedBook) {
            return res.status(404).send({ status: false, message: "Please Enter correct bookId" })
        }
        return res.status(200).send({ status: false, message: "successful", data: updatedBook })
    } catch (error) {
        if (error.message.includes('validation')) {
            return res.status(400).send({ status: false, message: error.message })
        } else if (error.message.includes('duplicate')) {
            return res.status(400).send({ status: false, message: error.message })
        } else {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
}
const deleteBook = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (!validation.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "please enter the valid book id" })
        }
        const deletedBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { $new: true })
        if (!deletedBook) {
            return res.status(404).send({ status: false, message: "Please Enter correct bookId" })
        }
        return res.status(200).send({ status: false, message: "successful", data: deletedBook })
    } catch (error) {
       return res.status(500).send({status:false, message:error.message})
    }
}
module.exports = { createBook, getAllBooks, getBook, updateBook, deleteBook }