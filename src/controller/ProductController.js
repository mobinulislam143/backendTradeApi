const ProductModel = require('../models/ProductModel')
const cloudinary = require('cloudinary').v2
const mongoose = require('mongoose')
const fs = require('fs')
const ObjectId = mongoose.Types.ObjectId


cloudinary.config({ 
    cloud_name: 'dmpsrcunj', 
    api_key: '368331831895173', 
    api_secret: '8P65ZkatdVy5oB4VdBa8APdY6h0' 
  });

exports.CreateProduct = async(req, res)=>{
    try{
        let UserID = req.headers.user_id
        let reqBody = req.body;
        reqBody.userID = UserID

        if(!req.file){
            return res.status(400).send({status: "fail", message: "No image found"})
        }
        const results= await cloudinary.uploader.upload(req.file.path)

        reqBody.image = results.secure_url

        let result = await ProductModel.create(reqBody)

        res.status(200).json({status: "success", data: result})
    }catch(e){
        res.status(400).json({status:"fail",data:"product create failed"})
    }
}
exports.AllProduct = async(req, res) => {
    try{
        let result = await ProductModel.find()

        res.status(200).json({status: "success", data: result})
    }catch(e){
        res.status(400).json({status:"fail",data:"product create failed"})
    }
}

exports.ReadProductById = async(req, res) => {
    try{
        let id = new ObjectId(req.params.productId)
        
        let result = await ProductModel.find({_id: id})

        res.status(200).json({status: "success", data: result})
    }catch(e){
        res.status(400).json({status:"fail",data:"product create failed"})
    }
}

exports.UserAllProduct = async(req, res) => {
    try{
        let UserID = new ObjectId(req.headers.user_id)
        let MatchStage = {$match: {userID: UserID}}

        let JoinWithUserStage = {
            $lookup: {
                from: "users",
                localField: "userID",
                foreignField: "_id",
                as:"user"
            }
        }
        let UnwindUserStage = { $unwind: "$user" };
   

        let data = await ProductModel.aggregate([
            MatchStage,
            JoinWithUserStage,
            UnwindUserStage,
        ]);

        res.status(200).json({status: "success", data: data})
    }catch(e){
        res.status(400).json({status:"fail",data:"product fetch failed"})
    }
}

exports.deleteProductByUser = async(req, res) => {
    try{
        let id = req.params.productId
        await ProductModel.deleteOne({_id: id})
        res.status(200).json({ status: "success", message: "data delete successfully" });
    }catch(e){
        res.status(400).json({status:"fail",data:e.toString()})
    }
}
exports.updateProduct = async(req, res) => {
    try{
        let id = req.params.productId
        let UpdateData = req.body

        if(req.file){
            let result = await cloudinary.uploader.upload(req.file.path)
            UpdateData.image = result.secure_url

            fs.unlinkSync(req.file.path)
        }

        await ProductModel.updateOne({_id: id}, UpdateData)
        res.status(200).json({ status: "success", message: "data update successfully" });
    }catch(e){
        res.status(400).json({status:"fail",data:e.toString()})
    }
}
exports.ProductByKeyword = async(req, res) => {
    try{
        let SearchRegex = {"$regex": req.params.keyword, "$options": "i"};
        let SearchParams = [{name: SearchRegex}]

        let SearchQuery = {$or: SearchParams};

        let MatchStage = {$match: SearchQuery}

        let data = await ProductModel.aggregate([
            MatchStage
        ])
        res.status(200).json({ status: "success", data: data});

    }catch(e){
        res.status(400).json({status:"fail",data:e.toString()})
    }
}



exports.ProductByBrandAndCategory = async (req, res) => {
    try {
        const { brand, category } = req.body;

        const brandRegex = brand ? new RegExp(brand, "i"):null
        const categoryRegex = brand ? new RegExp(category, "i"):null

        const searchParams = {};
        
        if (brandRegex) {
            searchParams.brand = brandRegex;
        }
        if (categoryRegex) {
            searchParams.category = categoryRegex;
        }

        let MatchStage = { $match: searchParams };

        const data = await ProductModel.aggregate([
            MatchStage
        ]);
        res.status(200).json({ status: "success", data: data });
    } catch (error) {
        res.status(400).json({ status: "fail", data: error.toString() });
    }
};



