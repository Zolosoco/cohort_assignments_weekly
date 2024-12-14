const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const {SignUp, SignIn, auth, createTodo, listTodos} = require('./middlewares');


app.use(express.json()); //body parsing application level middleware

//connecting with db:
mongoose.connect('');


//routes:
app.post('/signup', SignUp);
app.post('/signin', SignIn);

app.use(auth);
app.post('/todo', createTodo);
app.get('/todos',listTodos);



//Initiating the server:
app.listen(port, () => {
    console.log(`The server started listening in on port: ${port}`);
});

