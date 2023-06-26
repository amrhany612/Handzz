const ownerModel = require('../models/ownerModel')
const formModel = require('../models/formModel')
const session = require('express-session')
const cookies = require('cookie-parser')



exports.loginOwnerPage = (req,res)=>{
    res.render("log in shop.ejs")
}

exports.getForm = (req,res)=>{
    res.render("index2.ejs")
}

exports.getInfo = async(req,res)=>{
    const content_type = req.headers['content-type']
    const storeInfo =  new formModel({
        type:req.body.type,
        storeName:req.body.storeName,
        ph:req.body.ph,
    })
    await storeInfo.save().then(()=>{
        if(content_type && content_type.includes('json')){
            res.status(200).json({storeInfo,msg:"Form Sent"})
        }else{
            res.status(200).redirect("/success")
        }
        
    }).catch((err)=>{
        for (let e in err.errors) {
            res.status(500).send(err.errors)
        }
})
}

exports.getPage = (req,res)=>{
    res.render("signupOwner.ejs")
}
exports.addowner = async(req,res)=>{
   
    const myOwner = new ownerModel({
        fname:req.body.fname,
        lname:req.body.lname,
        username:req.body.username,
        address:req.body.address,
        ph:req.body.ph,
        password:req.body.password,
        type:req.body.type
    })
    await myOwner.save().then(()=>{
        res.status(200).redirect("/login")
    }).catch((err)=>{
        for (let e in err.errors) {
            res.status(500).send(err.errors)
        }
})
}

exports.successPage = (req,res)=>{
    res.render("success.ejs")
}

// exports.getDash = (req,res)=>{
//     id =req.params.id
//     const owner = ownerModel.findById(id)
//     const isOwner = req.session.isOwner || false
//     res.render("dash.ejs",{owner})
// }