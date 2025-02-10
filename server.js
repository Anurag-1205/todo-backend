const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require("path")
const port = 3000;
const app = express();
const cors = require("cors");

const corsOptions = {
    origin: 'https://todo-frontend-brown-ten.vercel.app/', // Allow only requests from this origin
    methods: 'GET,POST,DELETE,PUT', // Allow only these methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow only these headers
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

   
app.post("/todos", (req, res) => {
  let newTodo = {
    id: Math.floor(Math.random() * 100000),
    title: req.body.title,
    description: req.body.description
  };
  fs.readFile("todos.json", "utf8", (err, data) => {
    if(err) throw err;
    const todos = JSON.parse(data);
    todos.push(newTodo);
    fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
      if(err)throw err;
      res.status(201).json(newTodo);
    });
  });
});

app.get("/todos", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if(err) throw err;
    res.json(JSON.parse(data));
  })
})

app.get("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if(err) throw err;
    const todos = JSON.parse(data);
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if(!todo){
      res.status(404).send();
    } else{
      res.json(todo);
    }
  });
});

app.put("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if(err) throw err;
    const todos = JSON.parse(data);
    const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id))
    if(todoIndex === -1){
      res.status(404).send();
    }else{
      todos[todoIndex].title = req.body.title;
      todos[todoIndex].description = req.body.description;
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if(err) throw err;
      })
      res.json(todos[todoIndex]);
    }
  });
});

app.delete("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if(err) throw err;
    const todos = JSON.parse(data);
    const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id))
  if(todoIndex === -1){
    res.status(404).send()
  }else{
    todos.splice(todoIndex, 1);
    fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
      if(err) throw err;
    })
    res.status(200).send()
  }
  })
  
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
})

function startServer(){
  console.log(`Server in running on port: ${port}`);
}
app.listen(port, startServer);
