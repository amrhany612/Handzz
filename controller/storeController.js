const { parse } = require("dotenv")
const store = require("../models/storeModel")
const sharp = require('sharp')
require('dotenv').config()
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublishKey = process.env.STRIPE_PUBLISH_KEY
const stripe = require('stripe')(stripeSecretKey)


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
    res.render('store/payment.ejs',{
        key:stripePublishKey
    })
    // console.log(req.session.user.username)
}

// exports.payementPage2 = (req,res)=>{
    
//     if (req.session.user) {
//         stripe.customers.create({
//             name:req.session.user.fname,
//             username:req.session.user.username,
//             address:req.session.user.address,
//         })
//         .then((customer)=>{
//             stripe.charges.create({
//                 amount:'2000',
//                 description:"Web Developement",
//                 currency:'usd',
//                 customer:customer.id,
                
//         })})
//         .then((charge)=>{
//             res.send('success')
//             console.log(charge)
//         })
//         .catch((err)=>{
//             console.log(err)
//         })
//     }else{
//         res.redirect('/login')
//     }
// }
//     // console.log(req.session.user.username)

// exports.addToCart = async(req,res)=>{
//     const id = req.params.id
//     const name = req.params.name
//     const Store = await store.findById(id)
//     const storeProduct = Store.products.name
//     const index = storeProduct.findIndex(element => element == name)
//     const number = req.body.number

//     let cart = {product:[],totalPrice:0} 
//     if(Store.products.name[index]){
//         if(Store.products.amount[index] != 0){
//             cart.product.push(Store.products.name[index],Store.products.amount[index],Store.products.img[index])
//             cart.totalPrice += number * Store.products.price[index]
//         }else{
//             res.status(200).json({message:'This product is not exist now.'})
            
//         }
//     }else{
//         res.status(200).json({message:'We can not find this product in this store.'})

//     }
//     res.render('store/checkout.ejs',{cart,number})

// }