require('dotenv').config();
const mongoose = require('mongoose');
const {Router} = require('express');
const adminRouter = Router();
const PORT = process.env.PORT || 9090;
const {z} = require('zod');
const bcrypt = require('bcrypt');
const {adminModel,courseModel} = require('../models/db');
const JWT_SECRET = process.env.ADMIN_SECRET;
const {auth} = require('../middlewares/adminAuthMiddleware');
const jwt = require('jsonwebtoken');



adminRouter.post('/signup', async function(req,res){
    const {email, password, firstName, lastName} = req.body;
    //input validation :
    const adminSchema = z.object({
        email : z.string().email({message : `enter a valid email ID`}),
        password: z.string(),
        firstName : z.string(),
        lastName : z.string()
    });

    //writing data to mongo table:
    try{
        const validSchema = adminSchema.parse({
            email,
            password,
            firstName,
            lastName
        });

        if(validSchema){
            const encryptedPassword = await bcrypt.hash(password, 5);
            
            await adminModel.create({
                email,
                password : encryptedPassword,
                firstName,
                lastName
            });

            res.json(`New Admin:${firstName}, signed-up succesfully!`);
        }else{
            throw new Error(`invalid credentials, please sign-up again!`);
        };
    }catch(error){
        res.status(500).json({message : `internal server error!`, error: error.message});
    };

});


adminRouter.post('/signin', async function(req,res){
    const {email, password} = req.body;
    // input validation:
    try{
        const user = await adminModel.findOne({
            email : email
        });

        if(user){
            const decryptedPassword = await bcrypt.compare(password, user.password);
            if(decryptedPassword){
                const token = jwt.sign({
                    adminId : user._id.toString()
                },JWT_SECRET);
                res.set('authorization', token);
                res.json({
                   message : `${user.firstName}, welcome back!`
                }).status(200);
            }else{
                throw new Error(`The password is invalid!`);
            };
         }else{
            throw new Error(`Invalid credentials: user not found!`);
         };
    }catch(error){
        res.status(403).json({message:`Invalid credentials, please try again!`, error : error.message});
    };
});


adminRouter.put('/create/courses',auth, async function(req,res){
    const adminId = req.adminId;
    const {title, description, price, imageUrl} = req.body;
    // input validation with zod:
    const courseSchema = z.object({
        title : z.string(),
        description : z.string(),
        price : z.number(),
        imageUrl : z.string().url()
    });

    //creating tabular entry of the course:
    try{
        const validation = courseSchema.parse({
            title,
            description,
            price,
            imageUrl
        });

        if(validation){
            await courseModel.create({
                title,
                description,
                price,
                imageUrl,
                courseCreatedBy : adminId
                
            });

            res.status(200).json({message : `course created succesfully!`});

            
        }else{
            throw new Error(`incorrect course details, please try again!`);
        };

    }catch(error){
        res.status(500).json({message :`Internal server error!`, error : error.message});
    };
});


adminRouter.get('/my/courses', auth, async function(req,res){
    const adminId = req.adminId ;
    //fetching course details :
    try{
        const response = courseModel.findOne({
            courseCreatedBy.adminId : adminId
        });

        if(response){
            res.json({
                response.courseCreatedBy
            }).status(200);
        }else{
            throw new Error(`Invalid session, try logging in again!`);
        };
    }catch(error){
        res.status(403).json({error: error.message});
    };
});




module.exports = ({
    adminRouter
})