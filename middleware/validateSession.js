module.exports=function(req,res,next){
    if(req.user.changepassword) return res.send({changepassword:true,msg:"change password"})
    next()
}