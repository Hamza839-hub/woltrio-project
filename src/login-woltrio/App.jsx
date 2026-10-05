import React, { useEffect, useState } from 'react'
import './App.css'
import TodoApp from "../todo-wol/App.jsx";
const App = () => {
  const[isSignup,setIsSignup]=useState(false)
  const [user,SetUser]=useState(null)
  const [name , SetName]=useState("")
  const [fatherName , SetFatherName]=useState("")
  const [dob , SetDob]=useState("")
  const [phone , SetPhone]=useState("")
  const [address, SetAddress]=useState("")
const [email , SetEmail]=useState("")
const [password , SetPassword]=useState("")
const [message , SetMessage]=useState("")
const todayDate=new Date().toISOString().split("T")[0]
//login user profile fetch function

const fetchUserProfile=(token)=>{
  fetch("http://localhost:5000/profile",{
    method:"GET",
    credentials:"include"
  })
  .then((res)=>{
    if(!res.ok)
      
       {
        throw new Error("Unauthorized")
      }
    return res.json()
  })
  .then((data)=>{
    if(data&&data._id){
      SetUser(data)
    }else{
      SetUser(data)
    }
  })
  .catch(()=>{SetMessage(null)})
}
 useEffect(()=>{
    fetchUserProfile()
},[])
  const  handleSubmit=(e)=>{
    e.preventDefault()
    const endpoint = isSignup ? "/register": "/login"
    const payload=isSignup
    ?{name,fatherName,dob,phone,address,email,password}
    :{email,password}
    fetch(`http://localhost:5000${endpoint}`,{   
      method:"POST",
      headers:{"content-type":"application/json"},
      credentials:"include",
      body: JSON.stringify(payload),
     })
     .then((res)=>res.json())
     .then((data)=>{
      //tokken and user data
       if(data.success){
      
         SetMessage("")
        fetchUserProfile()
      }else{
        SetMessage(data.error||"Something went wrong")
      }
       })
       .catch(()=>SetMessage("Server Connection Error")) 
  }
 
    const handleLogout=()=>{
      fetch("http://localhost:5000/logout",{
        method:"POST",
        credentials:"include"
      })
      .finally(()=>{
      SetUser(null)
        SetName("")
        SetDob("")
        SetPhone("")
        SetAddress("")
        SetEmail("")
        SetPassword("")
    })
  }
  if(user){
    return(
      <div className='div'>
        <h2 className='h2'>Todo App Dashboard</h2>
        <br></br>
        <TodoApp />
        <br></br>
        <button className='btn2' onClick={handleLogout}>LogOut</button>
        
      </div>
    )}
  return (
    
    <div className='container'>
      <h1>Wellcome TodoApp</h1>
      <h2 className='h2'>{isSignup ? "Signup Form" : "Login Form"}</h2>
      <form className='form' onSubmit={handleSubmit}>
        {isSignup ? (
          <>
        <input 
         className='input1'
        type='text'
        placeholder='Full name (e.g. Ali)'
        maxLength={15}
        pattern="^[A-Z][a-zA-z\s]*$"
        title='first letter must be capital and max 15 charc'
        value={name}
        onChange={(e)=>SetName(e.target.value)}
        required
        />
        <br></br>
        <input 
         className='input1'
        type='text'
        placeholder='Father name (e.g. Ali)'
         maxLength={15}
        pattern="^[A-Z][a-zA-z\s]*$"
        title='first letter must be capital and max 15 charc'
        value={fatherName}
        onChange={(e)=>SetFatherName(e.target.value)}
        required
        />
        <br></br>
        <input 
         className='input1'
        type='date'
        placeholder='Date of birth'
        max={todayDate}
        value={dob}
        onChange={(e)=>SetDob(e.target.value)}
        required
        />
        <br></br>
        <input 
         className='input1'
        type='tel'
        placeholder='Phone Number'
        maxLength={11}
        pattern='^[0-9]{11}$'
        title='must be add 11 numerics digits'
        value={phone}
        onChange={(e)=>SetPhone(e.target.value)}
        required
        />
        <br></br>
        <input 
         className='input1'
        type='text'
        placeholder='Address'
        maxLength={60}
        value={address}
        onChange={(e)=>SetAddress(e.target.value)}
        required
        />
        <br></br>
         <input 
         className='input1'
        type='email'
        placeholder='Email'
        autoComplete="username"
        value={email}
        onChange={(e)=>SetEmail(e.target.value)}
        required
        />
        
        <br></br>
        <input 
        className='input1'
        type='password'
        autoComplete="current-password"
        placeholder='Password'
        maxLength={8}
        pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$"
        title='min 8 characters, atleast uppercase,num,(eg.!,@,#)'
        value={password}
        onChange={(e)=>SetPassword(e.target.value)}
        />
        <br></br>
        </>
        ) : (
          <>
           <input 
         className='input1'
        type='email'
        placeholder='Email'
        autoComplete="username"
        value={email}
        onChange={(e)=>SetEmail(e.target.value)}
        />
        <br></br>
        <input 
        className='input1'
        type='password'
        autoComplete="current-password"
        placeholder='Password'
         maxLength={8}
        pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$"
        title='min 8 characters, atleast uppercase,num,(eg.!,@,#)'
        value={password}
        onChange={(e)=>SetPassword(e.target.value)}
        />
        <br></br>
        </>
        )}
        <button className='btn3' type='submit'>
       {isSignup ? "Signup": "Login"}
        </button>
      </form>
      <button
      className='btn4'
      type='button'
      onClick={()=>{
        setIsSignup(!isSignup)
        SetMessage(" ")
      }
      }
      >
{isSignup ? "Already account? => Login " : "Create New Account "}
      </button>
      {message&&(
        <p className='p'>{message}</p>
      )}
    </div>
  )
}
export default App
