const express = require("express");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
app.use(express.json());

const dbURL = process.env.DB_URL;

// Connect to MongoDB with proper error handling
mongoose.connect(dbURL)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((error) => {
            console.error("Error connecting to MongoDB:", error);
            process.exit(1); // Exit process with failure
        });

// Import and use routes 
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const courseRouter = require("./routes/courses");

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

app.listen(port, () => { 
    console.log(`App is Live at Port ${port}`);
});