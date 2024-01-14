const mongoose = require('mongoose')
const {Schema} = mongoose;

const todo_schema = new Schema({
    text:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    }
})

const Todo = mongoose.model("Todo",todo_schema);

module.exports = Todo