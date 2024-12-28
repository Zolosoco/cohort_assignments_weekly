require('dotenv').config();
const express = require('express');
const app = express();
const {userRouter} = require('./routes/userRouter');
const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL;
const port = process.env.PORT || 8080;
const{adminRouter} = require('./routes/adminRouter');



app.use(express.json());
main();

app.use('/user',userRouter);
app.use('/admin', adminRouter);

async function main(){
    try{
        const response = await mongoose.connect(MONGO_URL);
        if(response){
            app.listen(port,() => {
                console.log(`The server started on port : ${port}`);
            });
        }else{
            throw new Error(`DB connection failed!`);
        };
    }catch(error){
        console.error(error.message);
    };
};




