const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));


mongoose.connect('mongodb://localhost:27017/todo-db', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});


const Todo = require('./Models/todo-schema');

app.get('/todos',async (req,res)=>{
    try{
        const todos = await Todo.find();
        res.json(todos);
    }catch(error){
        console.error(error);
        res.status(500).json({error:'Internel Server Error'})
    }
});

app.post('/todo/new',async (req,res) =>{
    try{
        const todo = new Todo({
            text:req.body.text
        });

        const savedTodo = await todo.save();
        res.json(savedTodo);
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    
    app.delete('/todo/delete/:id',async (req,res) =>{
        const result = await Todo.findByIdAndDelete(req.params.id);
        res.json(result);
    });

    app.get('/todo/completed/:id',async (req,res) =>{
        const todo = await Todo.findById(req.params.id);
        todo.completed = !todo.completed
        todo.save();
        res.json(todo);
    })

    app.listen(4000,()=>{
        console.log("Server started at port 4000")
    });