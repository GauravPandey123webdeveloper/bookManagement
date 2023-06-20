const userModel = require('../models/userModel')
const valid = require('../validators/valid')
const jwt = require('jsonwebtoken')
const registerUser = async function (req, res) {
  try {
    const { name, phone, email, password } = req.body
    if (!valid.isValidData(name)) {
      return res.status(400).send({ status: false, message: "Please Enter a valid name in only lowercase and uppercase letters" })
    }
    if (!valid.validMobile(phone)) {
      return res.status(400).send({ status: false, message: "Please Enter a valid mobile number with 10 digits" })
    }
    if (!valid.validEmail(email)) {
      return res.status(400).send({ status: false, message: "Please Enter a valid email address" })
    }
    if (!valid.validPassword(password)) {
      return res.status(400).send({ status: false, message: "please Enter a valid password with min length 8 and max 15" })
    }
    const data = await userModel.create(req.body)
    res.status(201).send({ status: true, data: data })

  } catch (err) {
    if (err.message.includes('validation')) {
      return res.status(400).send({ status: false, message: err.message })
    }
    else if (err.message.includes('duplicate')) {
      return res.status(400).send({ status: false, message: err.message })
    }
    else {
      return res.status(400).send({ status: false, message: err.message })
    }

  }
}
const login = async function (req, res) {
  try {
    const data = req.body
    const user = await userModel.findOne(data)
    if (!user) {
      return res.status(400).send({ status: false, message: "Please Enter correct user name and password" })
    }
    const token = jwt.sign({ userId: user._id.toString() }, "userCreatedToken", { expiresIn: "1h" })
    res.setHeader('x-auth-api',token)
    return res.status(200).send({
      token, userId: user.id, exp: Math.floor(Date.now() / 1000) + 3600, iat: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
     return res.status(500).send({status:false, message:error.message})
  }
}

module.exports = { registerUser,login }