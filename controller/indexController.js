const store = require("../models/storeModel")
const product = require("../models/products")
const contact = require('../models/contactModel')
const sharp = require('sharp')
exports.indexPage = async(req,res)=>{
    const isAuthenticated = req.session.isAuthenticated || false;
    const resizedBuffer = await sharp(Store.logo.data)
    .resize(97, 56)
    .toBuffer();
    const resizedImage = resizedBuffer.toString('base64');
    res.render("index.ejs",{isAuthenticated,resizedImage})
}

exports.getStore = async(req,res)=>{
    const id = req.params.id
    const Store = await store.findOne({_id:id})
    Store.toJSON()
    if(!Store){
        res.redirect("/")
    }
    let product = 0
    for(i in Store.products.toJSON()){
        product += 1
    }
    // sharp(req.file.buffer).resize(97,56).toBuffer().then(
    //     resizedBuffer => {
    //         myStore.logo.data = resizedBuffer;
    //     }
    // )
    const resizedBuffer = await sharp(Store.logo.data)
    .resize(90,87)
    .toBuffer();
    const resizedImage = resizedBuffer.toString('base64');
    res.render('store/index.ejs',{Store,product,resizedImage})
    // console.log(req.session.user.fname)
}

// exports.getStore = async(req,res)=>{
//     const id = req.params.id
//     const Store = await store.findOne({_id:id})
//     if(!Store){
//         return res.redirect("/")
//     }
//     let product = 0
//     if (Array.isArray(Store.products) && Store.products.length) {
//         product = Store.products.length
//     }
//     console.log(product)
//     res.render('store/index.ejs',{Store})
// }

exports.contact = (req,res)=>{
    
  const Contact = new contact({ name:req.body.contactname,subject:req.body.subject, email:req.body.email, message:req.body.message });

  Contact.save()
    .then(() => {
      res.redirect('/')
    })
    .catch(err => {
      console.error(err);
      res.send('Oops, something went wrong. Please try again later.');
    });
}