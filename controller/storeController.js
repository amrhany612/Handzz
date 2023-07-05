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
 
    let cart = {product:{name:[req.body.item_name],quantity:[req.body.quantity],price:[req.body.amount]}}
    res.render('store/checkout.ejs',{cart})
}

exports.payementPage = (req,res)=>{
    res.render('store/payment.ejs')
}

exports.addToCart = async(req,res)=>{
    const id = req.params.id
    const name = req.params.name
    const Store = await store.findById(id)
    const storeProduct = Store.products.name
    const index = storeProduct.findIndex(element => element == name)
    const number = req.body.number

    let cart = {product:[],totalPrice:0} 
    if(Store.products.name[index]){
        if(Store.products.amount[index] != 0){
            cart.product.push(Store.products.name[index],Store.products.amount[index],Store.products.img[index])
            cart.totalPrice += number * Store.products.price[index]
        }else{
            res.status(200).json({message:'This product is not exist now.'})
            
        }
    }else{
        res.status(200).json({message:'We can not find this product in this store.'})

    }
    res.render('store/checkout.ejs',{cart,number})

}