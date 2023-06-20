const jwt = require("jsonwebtoken");
const bookModel=require("../models/bookModel")
const validation=require('../validators/valid')
// checking authentication
const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-auth-api"];
    if (!token) {
      res.status(401).send({ status: false, message: "Please log in First " });
    } else {
      const decodedToken = jwt.verify(
        token,
        "userCreatedToken"
      );
      if (!decodedToken) {
        res
          .status(401)
          .send({ status: false, message: "verification failded" });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    }
  } catch (err) {
    res.status(401).send({ status: false, message: "Authentication failed" });
  }
};
// checking the authorisation by authorid
const authorisation = async function (req, res, next) {
  try {
    const bookId = req.params.bookId;
    if(!validation.isValidObjectId(bookId)){
        return res.status(400).send({status:false,message:"please enter the valid book id"})
    }
    const uid = await bookModel.findOne({ _id: bookId }).select({ _id: 0, userId: 1 });
    const decId = req.decodedToken.userId;
    if(decId==uid.userId){
        next()
    }
    else{
       return res.status(403).send({status:false,message:"You are not authorised"})
    }
  } catch (err) {
    res.status(400).send({ status: false, message: "invailid objectId" });
  }
};
module.exports = { authentication, authorisation };