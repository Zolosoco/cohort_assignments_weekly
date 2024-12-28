require('dotenv').config();
const {Router} = require('express');
const userRouter = Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.USER_SECRET;
const {z} = require('zod');
const bcrypt = require('bcrypt');
const { userModel, courseModel } = require('../models/db');
const {auth} = require('../middlewares/authMiddleware');




userRouter.post('/signup', async function(req,res){
    const {email, password, firstName, lastName } = req.body;
    //input validation with zod
    const userSchema = z.object({
            email : z.string().email({message:`Enter an email Id`}),
            password : z.string(),
            firstName : z.string().min(1,{message : `enter a valid name`}),
            lastName : z.string().min(1,{message :`enter a valid lastName`})
    });

    try{
        
        const validData = userSchema.parse({
            email,
            password,
            firstName,
            lastName
        })
        if(validData){
            const encryptedPassword = await bcrypt.hash(password, 5);

            await userModel.create({
                email,
                password : encryptedPassword,
                firstName,
                lastName
            });

            res.status(200).json({message : `${firstName}, signed-up Successfully!`});
        }else{
            throw new Error(`Invalid input try again!`);
        };
    }catch(error){
        res.status(500).json({message : `Internal server error!`, error: error.message});
    };
});


userRouter.post('/signin', async function(req,res){
    const {email , password} = req.body;
    //input validation:
    try{
        const user = await userModel.findOne({
            email : email
        });

        if(user){
            const decryptedPassword = await bcrypt.compare(password, user.password);
            console.log(decryptedPassword, password);
                if(decryptedPassword){
                    const token = jwt.sign({
                        userId : user._id.toString()
                    }, JWT_SECRET);

                    //setting the header before sending back the response:
                    res.set('authorization', token);
                    res.send(`${user.firstName}, welcome back!`)
                }else{
                    throw new Error(`Invalid password! please Try again!`)
                };
        }else{
            throw new Error(`Invalid email, try again!`);
            };
    }catch(error){
        res.status(403).json({message : `Forbidden access!`, error : error.message});
        };
    });


userRouter.put('/purchase/courses', auth, async function(req,res){
    const userId  = req.userId;
    const {courseId} = req.body;
    //course validation and user model update:
    try{
        const course = await courseModel.findOne({
            _id : courseId
        });
        if(course){
            const user = await userModel.findOneAndUpdate(
                {_id : userId},
                {$push : {purchasedCourses : courseId}}
            );

            if(!user){
                throw new Error(`not authorized, please sign-in again!`);
            }else{
                res.status(200).json({message : `succesfully bought: ${course.title}`});
            };


        }else{
            res.status(404).json({message : `course not available!`});
        }
    }catch(error){
        res.status(404).json({error : error.message});
    };
});


userRouter.get('/my/courses', auth, async function(req,res){
    const userId = req.userId;
    //fetching courses for the user form db:
    try{
        const user = await userModel.findOne({
            _id : userId
        });
        if(user){
            res.json({courses : user.purchasedCourses});
        }else{
            throw new Error(`user not found!`);
        };
    }catch(error){
        res.status(404).json({message : `resource not found!`, error : error.message});
    };
});


//exporting module userRouter:
module.exports = ({
    userRouter
});
