const jwt = require("jsonwebtoken");
const JWT_USER_SECRET =process.env.JWT_USER_SECRET;
const JWT_ADMIN_SECRET =process.env.JWT_ADMIN_SECRET;

function userAuth(req, res, next) {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }
        const decoded = jwt.verify(token, JWT_USER_SECRET);
        req.userId = decoded.userId;  // userId is provided as key for _id.toString(), while signing this token
        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired, please login again" });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token, please login again" });
        } else {
            // For other unexpected errors
            console.error("Authentication Middleware Error:", error);
            return res.status(500).json({ message: "Server error during authentication" });
        }
    }
}


function adminAuth(req, res, next) {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }
        const decoded = jwt.verify(token, JWT_ADMIN_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired, please login again" });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token, please login again" });
        } else {
            console.error("Authentication Middleware Error:", error);
            return res.status(500).json({ message: "Server error during authentication" });
        }
    }
}


function userAuthPractice(req, res, next) {
    const token = req.headers.token;
    if(!token) {
        return res.status(401).json({msg : "No Token Provided In headers, Authentication Denied"});
    }
    const verifyIdentity = jwt.verify(token, JWT_USER_SECRET);
    if(!verifyIdentity) {
        return res.status(401).json({msg : "Invalid Authentication"})
    }

    req.userId = verifyIdentity.userId;
    next();
}

module.exports = {
    userAuth : userAuth,
    adminAuth : adminAuth
};