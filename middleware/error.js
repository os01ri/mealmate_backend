exports.notFound=(req,res,next)=>{


    return res.status(404).json({message:"this page is not found"})


}