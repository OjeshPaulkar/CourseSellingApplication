const express = require("express");
const { Router } = require("express");
const adminRouter = Router();
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { userModel, adminModel, courseModel, purchaseModel } = require("../db/db");
const JWT_SECREAT =process.env.JWT_SECREAT;
const auth = require("../middlewares/index");

app.use(express.json());

adminRouter.post("/signup", async (req,res) => {
    try { 
        const inputSchema = z.object({
            email : z.string().email(),
            username : z.string().min(7).max(20),
            password : z.string()
                        .min(7)
                        .max(20)
                        .refine((password) => /[A-Z]/.test(password), {
                            message: "Password must consist of atleast one Upper case Character",
                        })
                        .refine((password) => /[a-z]/.test(password), {
                            message: "Password must consist of atleast one Small case character",
                        })
                        .refine((password) => /[!@#$%^&*()+-]/.test(password), {
                            message: "Password must consist of atleast one Special Character",
                        })
    })
        const verifiedData = inputSchema.safeParse(req.body);
        if(!verifiedData.success){
            return res.status(403).json({message: "Please Enter Valid Data for SIgnUp ", error: verifiedData.error.issues});
        }
        const { email, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 5);

        const signedUpUser = await adminModel.create({
            email,
            username,
            password: hashedPassword
        })
        res.status(200).json({msg: "you are Sucessfully Signed In", user: signedUpUser});
    } catch (error) {
        return res.status(500).json({msg: "There was an error in Server", err: error.message});
    }
})

adminRouter.post("/signin", async (req,res) => {
    try {
        const { email, password } = req.body;
        const user = await adminModel.findOne({
            email,
        })
        if(!user){
            return res.status(403).json({msg: "Invalid Email!"});
        }
        const verifyPassword = await bcrypt.compare(password, user.password);
        if(!verifyPassword){
            return res.status(403).json({msg: "Invalid Password!"});
        }
        const token = jwt.sign({
            userId : user._id.toString(), 
        }, JWT_SECREAT);

        return res.status(200).json({mag: "You are Successfully Signed In", token : token});
    } catch (error) {
        return res.status(500).json({msg: "There was an error in Server", err: error.message});
    }
})

adminRouter.post("/createcourse", auth,(req,res) => {
    res.send({msg: "under development"})
})

adminRouter.delete("/deletecourse", auth,(req,res) => {
    res.send({msg: "under development"})
})

adminRouter.post("/coursecontent", auth,(req,res) => {
    res.send({msg: "under development"})
})

module.exports = adminRouter;