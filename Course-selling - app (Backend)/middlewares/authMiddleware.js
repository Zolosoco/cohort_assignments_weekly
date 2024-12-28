require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.USER_SECRET;


async function auth(req,res,next){
    const  token = req.headers.authorization;
    //token decoding:
    try{
        const decodedToken =  jwt.verify(token, JWT_SECRET);
        req.userId = decodedToken.userId;
        next()
    }catch(error){
        res.status(403).json({message:`Session invalid, try signing in again!`, error : error.message});
    };

};

//exporting auth function : 

module.exports = ({
    auth
});