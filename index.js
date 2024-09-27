const express = require("express");
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");
const { userModel, adminModel, courseModel, purchaseModel } = require("./db/index");

// Access environment variables with uppercase convention
const dbURL = process.env.DB_URL; 
const port = process.env.PORT || 3000;

// Connect to MongoDB with proper error handling
mongoose.connect(dbURL)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((error) => {
            console.error("Error connecting to MongoDB:", error);
            process.exit(1); // Exit process with failure
        });

// Middleware to parse JSON
app.use(express.json());

// Import and use routes after middleware
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");

app.use("/user", userRoute);
app.use("/admin", adminRoute);

// Start the server
app.listen(port, () => {
    console.log(`App is Live at Port ${port}`);
});