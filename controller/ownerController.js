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
    const storeInfo = await new formModel({
        type:req.body.type,
        storeName:req.body.storeName,
        ph:req.body.ph,
    })
    storeInfo.save().then(()=>{
        res.status(200).redirect("/success")
    }).catch((err)=>{
        for (let e in err.errors) {
            res.status(400).send(err.errors)
        }
})
}

exports.successPage = (req,res)=>{
    res.render("success.ejs")
}