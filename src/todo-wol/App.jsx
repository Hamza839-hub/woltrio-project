import React, { useEffect } from "react";
import "./App.css";
import { useState } from "react";
const App = () => {
  const [task, setTask] = useState("");
  const [todo, settodo] = useState([]);
  const[editId,setEditId]=useState(null)
  const getTodos =()=>{
    fetch("http://localhost:5001/get-todos",{
      method:"GET",
      credentials:"include"
    })
    .then((res)=>{
      if(!res.ok){
        throw new Error("Unauthorized")
      }
      return res.json()
    })
    .then((data)=>{
      if(Array.isArray(data)){
        settodo(data)
      }
    })
    .catch((error)=>console.log("fetch error",error))
  }
  useEffect(()=>{
    getTodos();
  },[])
  const edittodo = (item) => {
    setTask(item.task);
    setEditId(item._id);
  };
  const AddorUpdateTodo = () => {
    if (task.trim() === "") return;
    if(editId){
      fetch(`http://localhost:5001/update-todo/${editId}`,{
      method:"PUT",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify({task:task}),
      credentials:"include"
})
   .then((res)=>res.json())
    .then((UpdatedTodo)=>{
      settodo(todo.map((item)=>(
        item._id===editId ? UpdatedTodo: item
      )
      ));
      setTask("");
      setEditId(null)
      })
       .catch((error)=>console.log("fetch error",error))
    }
  
  else{

     fetch('http://localhost:5001/add-todo',{
      method:"POST",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify({task:task}),
      credentials:"include"
})
   .then((res)=>res.json())
    .then((newTodo)=>{
     settodo([...todo,newTodo]);
      setTask("");
      })
       .catch((error)=>console.log("fetch error",error))
    }
  }
  
  const DeleteTodo = (id) => {
    fetch(`http://localhost:5001/delete-todo/${id}`,{
    method:"DELETE",
    credentials:"include"
    })
    .then(()=>{
    settodo(todo.filter(( item) => item._id !== id));
    })
     .catch((error)=>console.log("fetch error",error))
  };
  const DeleteAlltodos=()=>{
    fetch('http://localhost:5001/deleteAll',{
      method:"DELETE",
      credentials:"include"
    })
    .then(()=>{
      settodo([]);
    })
    .catch((error)=>console.log("fetch error",error))
  }
  return (
    <div className="body">

   
    <div className="container1">
      <h1 className="h1">Todo Lists</h1>
      <input
        type="text"
        className="input"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add or Edit Todo"
      />
      <button className="bt" onClick={AddorUpdateTodo}>
        {editId ? "Update Todo":"Add Todo"}
      </button>
      {
        todo.length > 0 &&(
          <button className="btn1" onClick={DeleteAlltodos}>DeleteAll</button>
        )
      }
      

      <ul>
        {todo.map((item) => (
          <li key={item._id}>{item.task}
          <br></br>
          <button className="btn" onClick={()=>edittodo(item)}>Edit todo</button>
          <button className="btn" onClick={() => DeleteTodo(item._id)}>
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
