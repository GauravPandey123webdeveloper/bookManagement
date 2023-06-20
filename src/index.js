const express= require("express")
const mongoose= require('mongoose')
const route= require('./route/route')
require('dotenv').config()
const app= express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
mongoose.connect(process.env.mongoDb,{useNewUrlParser:true}).then(()=>console.log("mongoDb has connected ")).catch(err=>console.log(err.message))
app.use('/',route)
app.listen(process.env.PORT, ()=>{
    console.log("server has started on the port ", process.env.PORT)
})

