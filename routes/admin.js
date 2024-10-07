const express = require("express");
const router = express.Router();
const adminRouter = router; 
const app = express();
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { adminModel, courseModel } = require("../db/db");
const { adminAuth } = require("../middlewares/middleware");
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;

app.use(express.json());

adminRouter.post("/signup", async(req,res) => {
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
        .refine((password) => /[!@#$%^&*()+-_]/.test(password), {
            message: "Password must consist of atleast one Special Character",
        })
    })
try {
    const verifyInputs = inputSchema.safeParse(req.body);
    if(!verifyInputs.success){
        return res.status(403).json({msg: "Please Enter Valid Credentials" , err: verifyInputs.error.issues});
    }
    const { email, username, password } = req.body;
    const userAlreadyExists = await adminModel.findOne({
        email,
    })
    if(userAlreadyExists){
        return res.status(403).json({msg: "User Already Exists, Please Proceed With Login"});
    }
    const hashedPassword = await bcrypt.hash(password,5);
    const newSignedUpAdminUser = await adminModel.create({
        email,
        username,
        password : hashedPassword
    })
    return res.status(200).json({msg : "New Admin User Sucessfully SignedUp", newSignedUpAdminUser});
} catch (error) {
    return res.status(500).json({msg : "Something Went Wrong", err: error.message});
} 
})

adminRouter.post("/signin", async ( req,res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminModel.findOne({
            email,
        })
        if(!admin){
            return res.status(403).json({msg: "Invalid Email"});
        }
        const verifyPassword = bcrypt.compare(password, admin.password);
        if(!verifyPassword) {
            return res.status(403).json({msg : "Invalid Password"});
        }
        const jwtToken = jwt.sign({
            userId : admin._id.toString(),
        }, JWT_ADMIN_SECRET);

        return res.status(200).json({msg : "User Sucessfully Signed In", token : jwtToken});
    } catch (error) {
        return res.status(500).json({msg : "Something Went Wrong", err: error.message});
    }
})

adminRouter.post("/createcourse", adminAuth, async (req,res) => {
    try {
        const { userId } = req;
        if(!userId) {
            return res.status(403).json({msg : "Invalid Token"});
        }
        const adminDetails = await adminModel.findOne({
            _id : userId,
        });
        if(!adminDetails) {
            return res.status(403).json({msg: "Admin Not Found"});
        }
        const userName = adminDetails.username;
        //can provide zod validations for inputs provided
        const { title, description, price, imageUrl} = req.body;
        const courseBody = await courseModel.create({
            title,
            description,
            price,
            imageUrl,
            creatorId : userId
        })
        return res.status(200).json({msg : "Congratulation " + userName + " , Your Course is Created Sucessfully", courseBody});
    } catch (error) {
        return res.status(500).json({msg : "Something Went Wrong", err: error.message});
    }
   
})


adminRouter.delete("/deletecourse", adminAuth, async (req,res) => {
    try {
        const { userId } = req;
        if(!userId) {
            return res.status(403).json({msg : "Invalid Token provided"});
        }
        const adminDetails = await adminModel.findOne({
            _id : userId,
        })
        if(!adminDetails) {
            return res.status(403).json({msg : "Admin does not exist"});
        }
        console.log("Admin Exists in records");
        const { courseId } = req.body;
        let courseDetials = undefined;
        try {
             courseDetials = await courseModel.findOne({
                _id : courseId,
            })
            console.log(courseDetials);
        } catch (error) {
            console.log(error.message);
            return res.status(403).json({err: "This Course does not exist"});
        }
        console.log("Course Exists in Records");
        if(courseDetials && courseDetials.creatorId == userId) {
            await courseModel.deleteOne({
                _id : courseId,
            })
           return res.status(200).json({msg : `Course with ID ${courseId} is Sucessfully Deleted`});
        } else {
            return res.status(403).json({err : "This course does not belogs to you"});
        } 
    } catch (error) {
        return res.status(500).json({msg : "Something Went Wrong", err: error.message});
    } 
})

adminRouter.post("/coursecontent", adminAuth,(req,res) => {
    res.send({msg: "under development"})
})

module.exports = adminRouter;