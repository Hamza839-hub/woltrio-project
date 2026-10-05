const express = require("express")
const mongoose = require("mongoose")
const cors= require("cors")
//library for JWT
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const authMiddleware=require("./middleware.cjs")
const {body,validationResult}=require("express-validator")
const verifyToken=require("./middleware.cjs")
const app=express()
app.use(cookieParser())
// secret key for JWT
const JWT_SECRET="my_secret_key_123"
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173", 

}))
mongoose
.connect("mongodb+srv://ha7412871_db_user:FJIOHUIDGYIFIUDIU@cluster0.lms5v7n.mongodb.net/login-wol")
.then(()=>console.log("database connected"))
.catch((err)=>console.log("DB error:",err))
const UserSchema = new mongoose.Schema({
    name:String,
    fatherName:String,
    phone:String,
    address:String,
    dob:String,
    email:String,
    password:String,
})
const User = mongoose.model("user",UserSchema)
const validationSchemaForRegister = [
    body("email")
        .isEmail().withMessage("Enter valid Email"),
    body("name")
        .isLength({ max: 15 }).withMessage("max 15 character")
        .matches(/^[A-Z][a-zA-Z\s]*$/).withMessage("first letter capital"),
    body("fatherName")
        .isLength({ max: 15 }).withMessage("max 15 character")
        .matches(/^[A-Z][a-zA-Z\s]*$/).withMessage("first letter capital"),
    body("phone")
        .matches(/^[0-9]{11}$/).withMessage("must be numbers"),
    body("password")
        .isLength({ max: 8 }).withMessage("max 8 characters").
        matches(/[A-Z]/).withMessage("must be added uppercase charac").
        matches(/[0-9]/).withMessage("must be added numbers").
        matches(/[@$!%*?&#]/).withMessage("must be add 1 special charactor"),
        body("address").
        isLength({max:60}).
        withMessage("max add 60 charac"),
        body("dob").
        custom((value)=>{
            const inputDate=new Date(value)
            const minDate = new Date("01-01-1900")
            const todayDate = new Date()
            if(inputDate<minDate||inputDate>todayDate){
                throw new Error("Date of birth 1900")
            }
            return true
        })]
const sendTokenCookie=(res,userId,message)=>{
    const token = jwt.sign({id:userId},JWT_SECRET,{expiresIn:"1h"})
    res.cookie("token",token,{
        httpOnly:true,
        maxAge:3600000,
        secure:false,
        sameSite:"lax",
    })
    return res.json({message, success:true})
}
app.post("/register",validationSchemaForRegister,async(req,res)=>{
   try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ error: errors.array()[0].msg });
    }
    const {email}=req.body
    const existinguser = await User.findOne({email})
    if(existinguser){
       return res.json({error:"Email  already Register!"})
    }
  
    const newUser = await User.create(req.body)
    // generate token
    return sendTokenCookie(res,newUser._id,"Registration successful!")
   
   }catch(err){
    return res.json({error:"Registration Error",success:false})
}
})

app.post("/update-profile",validationSchemaForRegister,async(req,res)=>{
    const errors =validationResult(req)
    if(!errors.isEmpty()){
        return res.json({error:errors.array()[0].msg})
    }
    const{userId, name, fatherName, dob, phone, address}= req.body
    try{
        const payload =  req.body
        const{userId, name, fatherName, dob, phone, address}=payload
        if(!userId){
            
            return res.status(400).json({error:"UserId is required:"})
        }
        await User.findByIdAndUpdate(userId,{
            name,
            fatherName,
            dob,
            phone,
            address,
        })
       return res.json({success:true,message:"profile successfully!"})
    }
    catch(error){
         res.json({success:false,message:"database updated error!"})
    }})
app.post("/login",async(req,res)=>{
   try{
    const payload= req.body.payload||req.body
    const {email,password}=payload
    const user = await User.findOne({email,password})
    if(user){
        // generate token
        return sendTokenCookie(res,user._id,"Login successful!")
        
    }
    else{
        return res.json({error:"invalid email or password!", success:false})
    }} catch(error){
    console.error("Login error:",error)
}})
//profile route with token verification
app.get("/profile",verifyToken,async(req,res)=>{
    try{
        const user = await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        res.json(user)
    } catch(error){
        console.error("Profile error:",error)
        res.status(500).json({error:"Internal server error"})
    }
})
//logout route to clear the token cookie
app.post("/logout",(req,res)=>{
    res.clearCookie("token")
    res.json({message:"Logout successfully!"})
})
app.listen(5000,()=>console.log("port on 5000"))