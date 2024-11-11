const express = require('express');

const app = express();

const cors = require('cors');

const port = process.env.PORT || 9001;



//application level middlewares:

app.use(express.json()) //body parser
app.use(cors())  // to allow cors



//middleware function
function add(req,res){
    try{
        const a = parseInt(req.body.a);
        const b = parseInt(req.body.b);

        //input vaidation 
        if(typeof(a) !== 'number' || typeof(b) !== 'number'){
            throw new Error('Invalid input, try again!')
        }else{
            res.status(200).json({sum : a+b })    
        };



    }catch(error){
        res.status(500).json({message : "internal server error!", error : error.message})
    }
};


app.post('/sum', add);

app.listen(port, () => {
    console.log(`The server is listening in on port: ${port}`);
});
