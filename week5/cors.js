const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

function sum(req,res){
    try {    
    const a = parseInt(req.body.a);
    const b = parseInt(req.body.b);
    //validating input;
    if(typeof(a) !== 'number' || typeof(b) !== 'number'){
        throw new Error('Invalid input try again!');
    };
   
    res.status(200).json({sum : a + b, message : 'added succesfully!'})

}catch(error){
    res.status(500).json({message : "Internal server Error", error : error.message});
};


};

app.post('/', sum);

app.listen(port, () => {
    console.log(`The server is listening in on port: ${port}`);

});


