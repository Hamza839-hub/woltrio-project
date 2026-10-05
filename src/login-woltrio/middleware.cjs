const jwt=require("jsonwebtoken")
const JWT_SECRET="my_secret_key_123"
const verifyToken=(req,res,next)=>{
   const token=req.cookies.token ? req.cookies.token :null;
    if(!token){
        return res.status(401).json({error:"Unauthorized"})
    }
    try{
        const decoded=jwt.verify(token,JWT_SECRET)
        req.userId=decoded.id
        next()
    }catch(err){
        return res.status(403).json({error:"Invalid token"})
    }
}
module.exports=verifyToken;