const user = require("../models/usersModel")
const bcrypt = require('bcrypt') 

// exports.registerPage = (req,res)=>{
//     res.render("sign up.ejs")
// }
// exports.loginPage = (req,res)=>{
//     res.render("login.ejs")
// }
exports.addUser = async(req,res)=>{
   
    const myUser = await new user({
        fname:req.body.fname,
        lname:req.body.lname,
        username:req.body.username,
        address:req.body.address,
        ph:req.body.ph,
        password:req.body.password
    })
    myUser.save().then(()=>{
        res.status(200).redirect("/login/user")
    }).catch((err)=>{
        for (let e in err.errors) {
            res.status(400).send(err.errors)
        }
})
}

exports.loginUser = async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    
    const myuser = await user.findOne({username:username})
    const isEqual = await  bcrypt.compare(password,myuser.password)
    if (!isEqual || !myuser) {
        res.render('login.ejs',{message:'incorrect password or username'})    
    }else if(isEqual && myuser){
        res.redirect("/")
    }
}

