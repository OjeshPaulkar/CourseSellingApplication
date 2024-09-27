const jwt = require("jsonwebtoken");
const JWT_SECREAT =process.env.JWT_SECREAT;

function auth(req,res,next) {
    try {
        const { token } = req.headers;
        const verifyJWT = jwt.verify(token, JWT_SECREAT);
        if(verifyJWT){
            req.userId = verifyJWT.userId;
            next();
        }else{
            return res.status(403).json({message: "Invalid Session, Please Login again"});
        }
    } catch (error) {
        return res.status(500).json({msg: "There was an error in Server", err: error.message});
    }
}

module.exports = auth;