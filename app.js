const express = require('express');
const mongoos = require('mongoose');
const body_parser = require('body-parser')
require('dotenv').config()
const http = require('http');
const path = require('path')
const ejs  = require('ejs');
const bcrypt = require('bcrypt')
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const app = express();
const user = require("./models/usersModel")
const DB = 'mongodb+srv://amrh18039:TiOdQeAAfLqOqbkq@cluster0.tyrtmnv.mongodb.net/handzz'
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

// main page 

app.get('/',(req,res)=>{
    const isAuthenticated = req.session.isAuthenticated || false;
    res.render("index.ejs",{isAuthenticated})
}
)
// get login page 

app.get("/login",sessionchecker,(req,res)=>{
    res.render("login.ejs")
    
})

// login
app.post("/login",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    
    const myuser = await user.findOne({username:username})
    if(myuser){
        const compare = await  bcrypt.compare(password,myuser.password)
        if(compare){
            req.session.user = myuser
            req.session.isAuthenticated = true
            res.redirect("/")
        }else{
            res.redirect("/login")
        }
    }else{
        res.redirect("/register")
    }
    
  
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
    console.log("connection success")
}).catch((err)=>{
    console.log(err);
})



httpserver = http.createServer(app);
httpserver.listen(process.env.PORT,'127.0.0.1',()=>{
    console.log("server running...")
})


