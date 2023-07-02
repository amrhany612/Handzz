const express = require('express');
const mongoos = require('mongoose');
const multer = require('multer')
const sharp = require('sharp')
const body_parser = require('body-parser')
require('dotenv').config()
const http = require('http');
const path = require('path')
const ejs  = require('ejs');
const bcrypt = require('bcrypt')
const helmet = require('helmet');
const axios = require("axios")
const cors = require('cors');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const app = express();
const user = require("./models/usersModel")
const owner = require("./models/ownerModel")
const store = require("./models/storeModel")
require('./passport-setup')
const DB = 'mongodb://amrh18039:TiOdQeAAfLqOqbkq@ac-pjlsutq-shard-00-00.tyrtmnv.mongodb.net:27017,ac-pjlsutq-shard-00-01.tyrtmnv.mongodb.net:27017,ac-pjlsutq-shard-00-02.tyrtmnv.mongodb.net:27017/handzz?ssl=true&replicaSet=atlas-ezd372-shard-0&authSource=admin&retryWrites=true&w=majority'
const indexroute = require("./routes/route");
const passport = require('passport');
const expressEjsLayouts = require('express-ejs-layouts');


app.use(express.json())
app.use(body_parser.json())
app.use(body_parser.urlencoded({extended:true}));
app.use(helmet({
    contentSecurityPolicy:false,
    frameguard:false
}));
app.use(cors());
app.use(xss());
app.use(cookieParser())
app.use(flash())
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

app.set('Template engine','ejs')
app.set('views','temp')

app.use(passport.initialize())
app.use(passport.session())

app.use('/static',express.static('public'))
app.use('/css',express.static(__dirname+'/node_modules/bootstrap/dist/css'))
app.use("/",indexroute);



let sessionchecker = (req,res,next)=>{
    if(req.session.user&&req.cookies.user_sid){
        res.redirect("/")
    }else{
        next()
    }
}

let sessionchecker2 = (req,res,next)=>{
    if(!req.session.user&&req.cookies.user_sid){
        res.redirect("/")
    }else{
        next()
    }
}

let sessionchecker3 = (req,res,next)=>{
    if(!req.session.user&&!req.cookies.user_sid){
        res.redirect("/login/owner")
    }else{
        next()
    }

}

// main page 

app.get('/',async(req,res)=>{
        const isAuthenticated = req.session.isAuthenticated || false;
        const Content_Type = req.headers['content-type']
        const mystore = await store.find() 
        const resizedImages = []
        for(i in mystore){
            const resizedBuffer = await sharp(mystore[i].logo.data)
            .resize(100,100)
            .toBuffer();
            const resizedImage = resizedBuffer.toString('base64');
            resizedImages.push(resizedImage)
        }
            

        if(Content_Type && Content_Type.includes('json')){
            res.status(200).json({mystore,isAuthenticated:isAuthenticated})
        }else{
            res.status(200).render('index.ejs',{isAuthenticated,mystore,resizedImages})
        }
     
    // console.log(mystore.name)
       
    
})
// 



// get login page 
        
app.get("/login",sessionchecker,(req,res)=>{
    res.status(200).render("login.ejs")
    
})


// login
app.post("/login",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const Content_Type = req.headers['content-type']

    
    
    const myuser = await user.findOne({username:username})
    
    if(myuser){
        const Password =  await bcrypt.compare(password,myuser.password)
        if(Password){
                    req.session.user = myuser
                    req.session.isAuthenticated = true
                    if(Content_Type && Content_Type.includes('json')){
                        res.status(200).json({myuser,"msg":"Login Successful"})

                    }else{
                    res.status(200).redirect("/")
                
                    }
                }else{
                    if(Content_Type && Content_Type.includes('json')){
                        res.status(200).json({"msg":"Username or Password is incorrect"})

                    }else{
                    res.status(200).redirect("/login")
                
                    }
                }
                
            }else{
        if(Content_Type && Content_Type.includes('json')){
            res.status(200).json({"msg":"Username or Password is incorrect"})

        }else{
        res.status(200).redirect("/login")
        }
    }

 
  
})

app.get("/google",passport.authenticate('google',{scope:['profile','email']}))

app.get("/google/callback",passport.authenticate('google',{failureRedirect:'/login'}),
function(req,res){
    req.session.isAuthenticated = true
    res.redirect("/")
    
})
// owner login 

app.post("/login/owner",async(req,res)=>{
    const username = req.body.ownername;
    const password = req.body.ownerpassword;
    const Content_Type = req.headers['content-type']

    const myowner = await owner.findOne({username:username})
    if(myowner){
        const compare = await bcrypt.compare(password,myowner.password)
        if(compare){
            req.session.user = myowner
            req.session.isOwner = true
            if(Content_Type && Content_Type.includes('json')){
                res.status(200).json({myowner,"msg":"Login Successful"})

            }else{
            res.status(200).redirect(`/dash/${myowner.id}`)
        
            }
        }else{
            if(Content_Type && Content_Type.includes('json')){
                res.status(200).json({"msg":"Username or Password is incorrect"})

            }else{
            res.status(200).redirect("/login")
        
            }
        }
    }else{
        if(Content_Type && Content_Type.includes('json')){
        res.status(200).json({"msg":"Username or Password is incorrect"})
        }else{
            res.status(200).redirect("/login")
        }
    }
})

app.get('/dash/:id',sessionchecker3,async(req,res)=>{
    const id = req.params.id
    const myOwner = await owner.findOne({_id:id})
    res.render("dash.ejs",{myOwner})
})
// get register page 

app.get('/register',sessionchecker,(req,res)=>{
    const empty = false
    res.render("sign up.ejs",{empty})
})

app.post("/register",async(req,res)=>{
    const content_type = req.headers['content-type']
    const fname = req.body.fname
    const lname = req.body.lname
    const username= req.body.username
    const address = req.body.address
    const ph = req.body.ph
    const password=req.body.password
    const type = req.body.type
    let errors = []
    const myUser =  new user({
        fname:req.body.fname,
        lname:req.body.lname,
        username:req.body.username,
        address:req.body.address,
        ph:req.body.ph,
        password:req.body.password,
        type:req.body.type
    })
    if(fname == "" || lname=="",username==""|| address==""||ph==""||password==""){
        if(content_type && content_type.includes('json')){
            res.status(200).json({"msg":"All fields are required"})
        }else{
            
            errors.push({msg:'All fields are required'})
            const empty = true;
            res.render('sign up',{
                errors,
                empty
            })
        }
    }
    await myUser.save().then(()=>{
        if(content_type && content_type.includes('json')){
            res.status(200).json({myUser,msg:"Registered"})
        }else{
            res.status(201).redirect("/login")
        }
    }).catch((err)=>{
        res.status(500).json({msg:"Failed To Reach Server"})
    })

})

//logout
app.get("/logout",(req,res)=>{
    res.clearCookie("user_sid")
    res.redirect("back")
})



mongoos.connect(DB,{
useNewUrlParser:true,
useUnifiedTopology:true,
}).then(()=>{
    httpserver = http.createServer(app);
    httpserver.listen(process.env.PORT,()=>{
    console.log(`server runniung on: ${[process.env.PORT]}`)
})

}).catch((err)=>{
    console.log(err);
})



// httpserver = http.createServer(app);
// httpserver.listen(process.env.PORT,()=>{
//     console.log("server running...")
// })


