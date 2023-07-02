const { parse } = require("dotenv")
const store = require("../models/storeModel")
const sharp = require('sharp')

exports.getProduct = async(req,res)=>{
    const id = req.params.id
    const name = req.params.name
    const Store = await store.findById(id)
    const storeProduct = Store.products.name
    const index = storeProduct.findIndex(element => element == name)
    const resizedBuffer = await sharp(Store.logo.data)
    .resize(90,87)
    .toBuffer();
    const resizedImage = resizedBuffer.toString('base64');
    res.render('store/single.ejs',{Store,index,resizedImage})
    
}
exports.checkOutPage = (req,res)=>{
    
    const values = Object.values(req.body.quantity)
    const values2 = Object.values(req.body.item_name)
    res.render('store/checkout.ejs',{values,values2})
    console.log(values)
    console.log(values2)



    
}