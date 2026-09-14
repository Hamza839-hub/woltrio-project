import React from "react";
import "./App.css";
import { useState } from "react";
const App = () => {
  const [task, setTask] = useState("");
  const [todo, settodo] = useState([]);
  const AddTodo = () => {
    if (task.trim() !== "") {
      settodo([...todo, task]);
      setTask("");
    }
  };
  const DeleteTodo = (index) => {
    settodo(todo.filter((_, i) => i !== index));
  };
  return (
    <div className="body">

   
    <div className="container">
      <h1 className="h1">Todo App</h1>
      <input
        type="text"
        className="input"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add Todo"
      />
      <button className="bt" onClick={AddTodo}>
        Add Todo
      </button>
      

      <ul>
        {todo.map((item, index) => (
          <li key={index}>{item}
          <button className="btn" onClick={() => DeleteTodo(index)}>
        Delete Todo
      </button>
          </li>
        ))}
      </ul>
    </div>
     </div>
  );
};

export default App;
