const db = require("../../models");
exports.store=async(req,res,next)=>{



    let name=req.body.name;
    let price=req.body.price;
    let unit_id=req.body.unit_id;
    let price_by=req.body.price_by;
    let nutritional=req.body.nutritional;

    let ingredient=await db.ingredient.create({name,price,unit_id,price_by});

    let pivot=nutritional.map(object=>{
        let ob={};
        ob.ingredient_id=ingredient.id;
        ob.nutritional_id=object.id;
        ob.value=object.value;
        ob.unit_id=object.unit_id;
        ob.precent=object.precent;
        return ob;
    })
    await db.ingredient_nutritional.bulkCreate(pivot)
    ingredient=await db.ingredient.findByPk(ingredient.id,{include:[{model:db.nutritional,through:{attributes:["value","precent"]}},{model:db.unit}]})
    return res.success(ingredient,"the ingredient was created successfully")




}
    


exports.update=async(req,res,next)=>{

    let id=req.params.id;
    let name=req.body.name;
    let price=req.body.price;
    let unit_id=req.body.unit_id;
    let price_by=req.body.price_by;
    let nutritional=req.body.nutritional;
    await db.ingredient.update({name,price,unit_id,price_by},{where:{id}})

    await db.ingredient_nutritional.destroy({where:{ingredient_id:id}})

        let pivot=nutritional.map(object=>{
        let ob={};
        ob.ingredient_id=id;
        ob.nutritional_id=object.id;
        ob.value=object.value;
        ob.unit_id=object.unit_id;
        ob.precent=object.precent;
        return ob;
    })

    await db.ingredient_nutritional.bulkCreate(pivot)
     let ingredient=await db.ingredient.findByPk(id,{include:[{model:db.nutritional,through:{attributes:["value","precent"]}},{model:db.unit}]})
    
    return res.success(ingredient,"the ingredient was updated successfully")



}

exports.getall=async(req,res,next)=>{

    let ingredients=await db.ingredient.findAll({include:{model:db.nutritional,through:{attributes:["value"]}}});
    return res.success(ingredients,"this is all ingredients")


}

exports.get=async(req,res,next)=>{

    let id=req.params.id;
    let ingredient=await db.ingredient.findByPk(id,{include:{model:db.nutritional,through:{attributes:["value"]}}});
    return res.success(ingredient,"this is the ingredient")

}

exports.delete=async(req,res,next)=>{


    let id=req.params.id;
    await db.ingredient.destroy({where:{id}})
    return res.success({},"the ingredient is deleted")


}