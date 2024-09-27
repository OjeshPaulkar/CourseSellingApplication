const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    email: {type: String, unique: true},
    username: String,
    password: String
})

const Admin = new Schema({
    email: {type: String, unique: true},
    username: String,
    password: String
})

const Course = new Schema({
    
})

const Purchases = new Schema({
    
})

const userModel = mongoose.model("users", User);
const adminModel = mongoose.model("admin", Admin);
const courseModel = mongoose.model("course", Course);
const purchaseModel = mongoose.model("purchases", Purchases);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
};