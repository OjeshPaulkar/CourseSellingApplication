const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

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