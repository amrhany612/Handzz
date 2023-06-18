const express = require('express');
const mongoos = require('mongoose');
const multer = require('multer')
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
const DB = 'mongodb://amrh18039:TiOdQeAAfLqOqbkq@ac-pjlsutq-shard-00-00.tyrtmnv.mongodb.net:27017,ac-pjlsutq-shard-00-01.tyrtmnv.mongodb.net:27017,ac-pjlsutq-shard-00-02.tyrtmnv.mongodb.net:27017/handzz?ssl=true&replicaSet=atlas-ezd372-shard-0&authSource=admin&retryWrites=true&w=majority'
const indexroute = require("./routes/route");


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
      
        if(Content_Type && Content_Type.includes('json')){
            res.status(200).json({mystore,isAuthenticated:isAuthenticated})
        }else{
            res.status(200).render('index.ejs',{isAuthenticated,mystore})
        }
    
       
    
})


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
                        res.status(400).json({"msg":"Username or Password is incorrect"})

                    }else{
                    res.status(200).redirect("/login")
                
                    }
                }
            // }else{
            //     if(userAgent && userAgent.includes('Mobile')){
            //         res.status(400).json({"msg":"Login Faild"})

            //     }else{
            //     res.status(400).redirect("/login")
            //     }
                
            }else{
        if(Content_Type && Content_Type.includes('json')){
            res.status(400).json({"msg":"Username or Password is incorrect"})

        }else{
        res.status(400).redirect("/login")
        }
    }

 
  
})

// owner login 

app.post("/login/owner",async(req,res)=>{
    const username = req.body.ownername;
    const password = req.body.ownerpassword;

    const myowner = await owner.findOne({username:username})
    if(myowner){
        const compare = bcrypt.compare(password,myowner.password)
        if(compare){
            req.session.user = myowner
            req.session.isOwner = true
            res.redirect(`/dash/${myowner.id}`) 
        }else{
            res.redirect("/login/owner")
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
    res.render("sign up.ejs")
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


