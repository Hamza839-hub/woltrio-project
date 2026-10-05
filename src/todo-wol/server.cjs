const express=require('express')
const mongoose =require('mongoose')
const cors= require('cors')
const cookieParser=require('cookie-parser')
const verifyToken=require('./middleware.cjs')
const App=express()

App.use(express.json())
App.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}))
App.use(cookieParser())


mongoose
.connect("mongodb+srv://ha7412871_db_user:FJIOHUIDGYIFIUDIU@cluster0.lms5v7n.mongodb.net/login-wol")
.then(()=>console.log("database connected"))
.catch((err)=>console.log("DB error:",err))


const TOdoSchema = new mongoose.Schema({
    task:String,
    userId:{ type: mongoose.Schema.Types.ObjectId, required: true }
})
const todoModel=mongoose.model('todo',TOdoSchema)
App.get('/get-todos',verifyToken,async(req,res)=>{
    try{
        const todos = await todoModel.find({ userId: req.userId })
        res.json(todos)
    }
    catch(error){
         res.status(500).json({error : error.message})
    }

})

App.post('/add-todo',verifyToken,async(req,res)=>{
    try{
    
        const todos = await todoModel.create({task:req.body.task, 
            //user restricted
            userId:req.userId})
        res.json(todos)
        
    }
    catch(errror){
        res.status(500).json({error : errror.message})
    }

})
App.put('/update-todo/:id',verifyToken,async(req,res)=>{
    try{
       const updatedtodo = await todoModel.findByIdAndUpdate(
         {_id:id},
            {name:'newname'},
            {returnDocument:'after'},
        {_id:req.params.id,
      //user restricted 
        userId: req.userId },
        {task:req.body.task},
        {new:true}

       )
        res.json({updatedtodo})
    }
     catch(error){
         res.status(500).json({error : error.message})
    }
})

App.delete('/delete-todo/:id',verifyToken,async(req,res)=>{
    try{
        await todoModel.findByIdAndDelete(
            {_id:id},
            {name:'newname'},
            {new:true},
            {_id:req.params.id,
                //user restricted
        userId: req.userId },
        )
        res.json({message:"DELETED"})
    }
    catch(error){
         res.status(500).json({error : error.message})
    }

})
App.delete('/deleteAll',verifyToken,async(req,res)=>{
    try{
        await todoModel.deleteMany({ userId: req.userId })
        res.json({message:"All DELETED"})
    }
    catch(error){
         res.status(500).json({error : error.message})
    }

})
App.listen(5001,()=>{
    console.log("server running on port 5001")
}
)