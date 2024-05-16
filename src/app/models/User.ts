import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userId:String,
    email:String,
    password:String,
    pdfId:[{type:mongoose.Schema.Types.ObjectId,ref:"PDFs"}]
})

const PDFSchema = new mongoose.Schema({
    pdfId:String,
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"Users"},
    namespace:String
})

export const Users =  mongoose.model("Users",userSchema)
export const PDFs =  mongoose.model("PDFs",PDFSchema)