const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const validation=require('../validators/valid')
const addReview = async function (req, res) {
    try {
        const reviewData = req.body
        const bookId = req.params.bookId
        if(!validation.isValidObjectId(bookId)){
            return res.status(400).send({status:false,message:"please enter the valid book id"})
        }
        const checkBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1} }, { new: true}).lean()
        if (!checkBook) {
            return res.status(404).send({ status: false, message: "book does not found" })
        }
        const createdReview = await reviewModel.create(reviewData)
        checkBook["reviewsData"] = createdReview
        return res.status(201).send({ status: true, message: "review added successfuly", data: checkBook })

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
const updateReview = async function (req, res) {
    try {
        const reviewId = req.params.reviewId
        const bookId = req.params.bookId
        const data = req.body
        const checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean()
        if (!checkBook) {
            return res.status(404).send({ status: false, message: "book does not found" })
        }
        const reviewData = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { $set: data }, { new: true, upsert: true })
        if (!reviewData) {
            return res.status(404).send({ status: false, message: "review does not found" })
        }
        checkBook["reviewsData"] = reviewData
        return res.status(200).send({ status: true, message: "review added successfuly", data: checkBook })
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
const deleteReview = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId
      
        const reviewData = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true })
        if (!reviewData) {
            return res.status(404).send({ status: false, message: "review does not found" })
        }
        const checkBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews:- 1 } }, { new: true, upsert: true }).lean()
        if (!checkBook) {
            return res.status(404).send({ status: false, message: "book does not found" })
        }
        return res.status(200).send({status:true,message:"deleted successfuly"})
    } catch (error) {
       return res.status(500).send({status:false,message:error.message})
    }

}
module.exports= {addReview,updateReview,deleteReview}