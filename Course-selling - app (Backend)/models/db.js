const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema ({
    email : {type : String, unique: true},
    password : String,
    firstName : String,
    lastName : String,
    purchasedCourses : [{type:ObjectId, ref:'Course'}]
});


const Admin = new Schema ({
    email : {type : String, unique : true},
    password : String,
    firstName : String,
    lastName : String,
    courseCreated : [{
        type : ObjectId,
        ref:'Course'
    }]
});

const Course = new Schema({
    title : String,
    description : String,
    price : Number,
    imageUrl : String,
    courseCreatedBy : [{
        type : ObjectId,
        ref: 'Admin'
    }]
});


//creating models out of the Schemas above:

const userModel = mongoose.model('user', User);
const adminModel = mongoose.model('admin', Admin);
const courseModel = mongoose.model('course', Course);

//exporting the models:

module.exports = ({
    userModel,
    adminModel,
    courseModel
});

