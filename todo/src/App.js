import {useState, useEffect} from 'react';
import React from 'react';

const API_BASE = "http://localhost:4000";

function App() {
  const [todos,setTodos] = useState([]);
  const [popupActive,setpopupActive] = useState(false);
  const [newTodo,setNewTodo] = useState("");

  useEffect(()=>{
    GetTodos();
  },[]);

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched data:', data);
        setTodos(data);
      })
      .catch(err => console.error('Error fetching data:', err));
  };
  
  const completeTodo = async id =>{
    const data = await fetch(API_BASE + "/todo/completed/" + id)
      .then(res => res.json());

    setTodos(todos => todos.map(todo => {
      if(todo._id === data._id){
        todo.completed = data.completed;
      }
      return todo;
    }))
  }

  const deleteTodo = async id => {
    const data = await fetch(API_BASE + "/todo/delete/" + id,{method:"DELETE"})
      .then(res => res.json());

    setTodos(todos => todos.filter(todo => todo._id !== data._id))
  }

  const addTodo = async () => {
		const data = await fetch(API_BASE + "/todo/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json" 
			},
			body: JSON.stringify({
				text: newTodo
			})
		}).then(res => res.json());

		setTodos([...todos, data]);

		setpopupActive(false);
		setNewTodo("");
	}

  return (
    <div className="App">
      <h4>Your Tasks</h4>
      <div className="todos">
      {todos.map((todo, index) => (
        <div className={
          "todo" + (todo.completed ? " is-complete" : "")
        } key={todo._id} onClick={() => completeTodo(todo._id)}>
            <div className="checkbox"></div>
            <div className="text">{todo.text}</div>
            <span className="material-icons" onClick={() => deleteTodo(todo._id)}>delete</span>
        </div>
      ))}
      </div>
      <div className="addPopup" onClick={() => setpopupActive(true)}>+</div>

			{popupActive ? (
				<div className="popup">
					<div className="closePopup" onClick={() => setpopupActive(false)}>X</div>
					<div className="content">
						<h3>Add Task</h3>
						<input type="text" className="add-todo-input" onChange={e => setNewTodo(e.target.value)} value={newTodo} />
						<div className="button" onClick={addTodo}>Create Task</div>
					</div>
				</div>
			) : ''}
    </div>
  );
}

export default App;