const owner = require("../models/ownerModel")
const store = require("../models/storeModel")
const product = require("../models/products")
const contact = require("../models/contactModel")

const express = require('express')

const sharp =require('sharp')
const bcrypt = require('bcrypt') 
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const session = require('express-session')
const cookieParser = require("cookie-parser")
const MemoryStore = require('memorystore')(session)

const app = express()
app.use(cookieParser())
app.use(session({
    key:'user_sid',
    secret:process.env.secret,
    resave:false,
    saveUninitialized:false,
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
    cookie:{
        expires:180000,
    }
}))


app.use((req,res,next)=>{
    
    if(req.cookies.user_sid&&!req.session.user){
        res.clearCookie("user_sid")
    }
    next()
})

exports.adminChecker = (req,res,next)=>{
    if(req.session.user&&req.cookies.user_sid){
        next()
    }else{
        res.redirect('/admin')
    }
}
exports.getLogin = (req,res)=>{
    res.render('adminlogin.ejs')
}

exports.adminDash =async(req,res)=>{
    const mycontact = await contact.find()
    res.render('admindash.ejs',{mycontact})
}

exports.getDash = async (req,res)=>{
    username = req.body.adminname
    password = req.body.adminpassword
    const data = [username,password]
    if(username=="admin" && password=="admin"){
        
        req.session.user = data
        res.redirect('/admin-dash')

    }else{
        res.redirect('/admin')
    }
}

exports.createAccount = (req,res)=>{
    res.render('createAccount.ejs')
}

exports.addOwner = (req,res)=>{
   
    const myOwner = new owner({
        fname:req.body.fname,
        lname:req.body.lname,
        username:req.body.username,
        address:req.body.address,
        ph:req.body.ph,
        password:req.body.password,
    })
    myOwner.save().then(()=>{
        res.status(200).redirect("/admin-dash")
    }).catch((err)=>{
        for (let e in err.errors) {
            res.status(400).send(err.errors)
        }
})
}


exports.getOwners = async(req,res)=>{
    const myData = await owner.find()
    let n = 1
    if(!myData){
        res
        .status(400)
        .redirect("/admin")
    }else{
    res
    .status(200)
    .render('ownersdash.ejs',{myData , n})
    }
}

exports.deleteOwner = async (req,res)=>{
    const id = req.params.id
   
    const Owner = await owner.findOneAndDelete({_id:id})
    res.redirect("/admin/owners")
     
}

exports.editPage = async(req,res)=>{
    const id = req.params.id
    const Owner = await owner.findOne({_id:id})
    if(Owner){
        res.status(200).render('editowner.ejs',{Owner})
    }else{
        res.status(404).redirect("/admin/owners")
    }
}

exports.editOwner = async(req,res)=>{
    const id = req.params.id
    const fname = req.body.fname
    const lname = req.body.lname
    const address = req.body.address
    const ph = req.body.ph
    const myOwner = await owner.findByIdAndUpdate(id,{fname:fname,lname:lname,address:address,ph:ph})
    if(myOwner){
        res.redirect('/admin/owners')
    }else{
        res.status(400).redirect('/admin-dash')
    }
}

exports.marketPage = (req,res)=>{
    res.status(200).render('createMarket.ejs')
}
exports.productPage = (req,res)=>{
    res.status(200).render('addproducts.ejs')
}

exports.addStore = async (req,res)=>{
 
    const myStore = new store({
        
        name:req.body.Marketname,
        logo:{
            name:req.file.originalname,
            data:req.file.buffer,
            contentType:req.file.mimetype
        },
        owner:req.body.Ownername,
    
    })
    
  
    myStore.save().then(()=>{
        res.status(200).redirect("/admin-dash")
    }).catch((err)=>{
        for (let e in err.errors) {
            res.status(400).send(err.errors)
        }
})
}

// exports.addProduct = async (req,res)=>{
//         const myProduct =  new product({
//             type:req.body.type,
//             storename:req.body.Storename,
//             name: req.body.name,
//             price:req.body.price,
//             amount:req.body.amount,
//             img:req.file.filename
//         }) 
//         myProduct.save().then(()=>{
//             res.redirect("/products")
//         }).catch(()=>{
//             res.redirect("/create-account")
//         }) 
// }

exports.addProduct = async (req,res)=>{
    // const mystore1 = await store.findOne({name:req.body.Storename})
    const mystore = await store.findOneAndUpdate({name:req.body.Storename},{"$addToSet":{products:{
        type:req.body.type,
        name: req.body.name,
        price:req.body.price,
        amount:req.body.amount,
        img:req.file.filename
    }
    }
      })
//    const myProduct = new product({
//         type:req.body.type,
//         id:mystore.id,
//         name: req.body.name,
//         price:req.body.price,
//         amount:req.body.amount,
//         img:req.file.filename
//     })
//     await myProduct.save()
    if(mystore){
        res.redirect("/admin-dash")
    }else{
        res.redirect("/create-account/market")
    }

    console.log(req.body.Storename)
}