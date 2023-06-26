const user = require("../models/usersModel")
const bcrypt = require('bcrypt') 
const express=require('express')
const bodyParser = require('body-parser');
const app = express() 
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
// exports.registerPage = (req,res)=>{
//     res.render("sign up.ejs")
// }
// exports.loginPage = (req,res)=>{
//     res.render("login.ejs")
// }
exports.addUser = async(req,res)=>{
  
    const myUser = new user({
        fname:req.body.fname,
        lname:req.body.lname,
        username:req.body.username,
        address:req.body.address,
        ph:req.body.ph,
        password:req.body.password,
        type:req.body.type
    })
    
    try{
        const savedUser = await myUser.save();
        let content_type = req.headers['content-type'];
        if(content_type && content_type.includes('json')){
            res.status(201).json({savedUser,msg:"Registered"})
        }else{
            res.status(201).redirect("/login")
        }
        
    }catch(err){
        if(Content-Type && Content_Type.includes('json')){
            res.status(500).json(err)
        }else{
            res.status(500)
        }
    }
}    
    // myUser.save().then(()=>{
    //     if(Content-Type && Content_Type.includes('json')){
    //         res.status(200).json({'msg':"Registered"})
    //     }else{
    //         res.status(200).redirect("/login")
    //     }   
    // }).catch((err)=>{
    //     for (let e in err.errors) {
    //         res.status(400).send(err.errors)
    //     }}
// )

// exports.loginUser = async(req,res)=>{
//     const username = req.body.username;
//     const password = req.body.password;
    
//     const myuser = await user.findOne({username:username})
//     const isEqual = await  bcrypt.compare(password,myuser.password)
//     if (!isEqual || !myuser) {
//         res.render('login.ejs',{message:'incorrect password or username'})    
//     }else if(isEqual && myuser){
//         res.redirect("/")
//     }
// }

