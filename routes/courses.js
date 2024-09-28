const { Router } = require("express");
const courseRouter = Router();
const { userModel, adminModel, courseModel, purchaseModel } = require("../db/db");

courseRouter.get("/", (req,res) => {
    res.json({message: "this will show all course available on platform"});
})

courseRouter.get("/purchase", (req,res) => {
    res.json({message: "Will show Purchased courses by user"});
})

module.exports = courseRouter;