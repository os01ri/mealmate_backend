const db = require("../models");

module.exports=(permission)=>{

    return async(req,res,next)=>{

        let id=req.user.id;
        let admin=await db.admin.findByPk(id,{include:db.role});
        let permissions=admin.role.permission;
        if(permissions.indexOf(permission)!=-1){
            

            return next()
        }

        return res.error(403,"you dont have permission to do this action")
        
        

    }



}