require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.ADMIN_SECRET;



async function auth(req,res,next){
    const token = req.headers.authorization;
    //decoding the token:
    try{
        const decodedToken = jwt.verify(token, JWT_SECRET);
        if(decodedToken){
            req.adminId = decodedToken.adminId;
            next()
        }else{
            throw new Error(`Invalid session, unauthorized access!`);
        }
    }catch(error){
        res.status(403).json({error : error.message});
    };
};



module.exports = ({
    auth
});