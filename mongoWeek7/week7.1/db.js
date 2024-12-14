const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//creating the Schemas:

const User = new Schema ({
    name : String,
    email : {type : String, unique : true},
    password : String
});

const Todo = new Schema({
    userId : ObjectId,
    title : String,
    status : Boolean
});


//creating models based off of the schemas above:

const UserModel = mongoose.model('users', User);
const TodoModel = mongoose.model('todos', Todo);

//exporting the models
module.exports = ({
    UserModel,
    TodoModel
});

