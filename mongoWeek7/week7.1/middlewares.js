const jwt = require('jsonwebtoken');
const JWT_SECRET = '';
const {UserModel, TodoModel} = require('./db');

//middlewares below

async function SignUp(req,res){
    const {name, email, password} = req.body;

    try{
        await UserModel.create ({
            name : name,
            email : email,
            password : password
        });

        res.json({message : `Signed-Up Succesfully!`});

    }catch(error){
        res.status(500).json({error : error.message});
    };



};




async function SignIn(req,res){
    const {email, password} = req.body;
    
    // input validation:
    try{
        const user = await UserModel.findOne({
            email: email,
            password : password
        });

        if(user){
            const token = jwt.sign({
                userId : user._id.toString()
            }, JWT_SECRET);
            res.set('authorization', token).json({message : `Signed-In succesfully!` , token : token});
        }else{
            throw new Error('Invalid credentials,please try again!')
        };
    }catch(error){
        res.status(403).json({error : error.message} );
    };

};



//auth middleware to verify token and link db to CRUD with todo db:

function auth(req,res,next){
    const token = req.headers.authorization;
    //decoding the token:
    try{
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.userId = decodedToken.userId;
        next();


    }catch(error){
        if(error.message == JsonWebTokenError){
            res.json({error : `Invalid Session try signing in again!`});
        }else{
            res.status(403).json({error : error.message});
        };
    };
};



//creating todo end-point

async function createTodo(req,res){
    const userId = req.userId;
    const {title, status} = req.body;
    
    try{
        await TodoModel.create({
            userId : userId,
            title : title,
            status : status
        });

        res.json({message : `Todo-Added succesfully!`});


    }catch(error){
        res.status(500).json({error : error.message});
    };

};


// viewing todo end-point:
async function listTodos(req,res){
    const userId = req.userId;

    try{
        const todos = await TodoModel.find({
            userId : userId
        });

        res.send(todos);
    }catch(error){
        res.status(500).json({error : error.message});
    };
};



//exporting middlewares:

module.exports = ({
    SignUp,
    SignIn,
    auth,
    createTodo,
    listTodos
});
