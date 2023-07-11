const express = require('express');
const { check, validationResult } = require('express-validator');
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
const product = require("./models/products")
const userController = require("./controller/userController")
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublishKey = process.env.STRIPE_PUBLISH_KEY
const stripe = require('stripe')(stripeSecretKey)

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

// views
app.set('Template engine','ejs')
app.set('views','temp')

app.use(passport.initialize())
app.use(passport.session())

app.use('/static',express.static('public'))
app.use('/css',express.static(__dirname+'/node_modules/bootstrap/dist/css'))
app.use("/",indexroute);


// Middleware
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
        const myproduct = await product.find()
        const resizedImages = []
        for(i in mystore){
            const resizedBuffer = await sharp(mystore[i].logo.data)
            .resize(100,100)
            .toBuffer();
            const resizedImage = resizedBuffer.toString('base64');
            resizedImages.push(resizedImage)
        }
            

        if(Content_Type && Content_Type.includes('json')){
           
            res.status(200).json({mystore,isAuthenticated:isAuthenticated,resizedImages})
        }else{
            res.status(200).render('index.ejs',{isAuthenticated,mystore,resizedImages,myproduct})
        }
     
    // console.log(myproduct.type)
       
    
})

// Search  

app.post("/search",async(req,res)=>{
    const keyword = req.body.search;
    const result = await store.findOne({name:keyword});
    
    if(result){
        res.status(200).redirect(`/store/${result.id}`);
    }else{
        res.status(400).json({msg:'Store Not Found'});
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
    res.render("dashInjection.ejs",{myOwner})
})
// get register page 

app.get('/register',sessionchecker,(req,res)=>{
    
    res.render("sign up.ejs",{errors:null})
})

// app.post("/register",async(req,res)=>{
//     const content_type = req.headers['content-type']
//     const fname = req.body.fname
//     const lname = req.body.lname
//     const username= req.body.username
//     const address = req.body.address
//     const ph = req.body.ph
//     const password=req.body.password
//     const type = req.body.type
//     let errors = []
//     const myUser =  new user({
//         fname:req.body.fname,
//         lname:req.body.lname,
//         username:req.body.username,
//         address:req.body.address,
//         ph:req.body.ph,
//         password:req.body.password,
//         type:req.body.type
//     })
//     if(fname == "" || lname=="",username==""|| address==""||ph==""||password==""){
//         if(content_type && content_type.includes('json')){
//             res.status(200).json({"msg":"All fields are required"})
//         }else{
            
//             errors.push({msg:"All fields are required"})
//         }
//         errors.push({msg:"All fields are required"})
//     }else{
      
//         await myUser.save().then(()=>{
//         if(content_type && content_type.includes('json')){
//             res.status(200).json({myUser,msg:"Registered"})
//         }else{
//             res.status(201).redirect("/login")
//         }
//     }).catch((err)=>{
//         // res.status(500).json({msg:"Failed To Reach Server"})
//         console.log(err)
//     })
//     }
// })



// app.post("/register", async (req, res) => {
//   const content_type = req.headers['content-type']
//   const fname = req.body.fname
//   const lname = req.body.lname
//   const username = req.body.username
//   const address = req.body.address
//   const ph = req.body.ph
//   const password = req.body.password
//   const type = req.body.type
//   let errors = []
//   const myUser = new user({
//     fname: req.body.fname,
//     lname: req.body.lname,
//     username: req.body.username,
//     address: req.body.address,
//     ph: req.body.ph,
//     password: req.body.password,
//     type: req.body.type
//   })

//   if (fname == "" || lname == "", username == "" || address == "" || ph == "" || !password) {
//     if (content_type && content_type.includes('json')) {
//       res.status(200).json({ "msg": "All fields are required" })
//     } else {
//       errors.push({ msg: "All fields are required" })
//     //   res.status(400).redirect('/register')
//     }
//   } else {
//     // Hash the password before saving it to the database
//     const saltRounds = 10;
//     bcrypt.hash(password, saltRounds, function (err, hash) {
//       if (err) {
//         // Handle error
//         console.log(err);
//         res.status(500).json({ msg: "Failed to hash password" });
//       } else {
//         myUser.password = hash;

//         myUser.save().then(() => {
//           if (content_type && content_type.includes('json')) {
//             res.status(200).json({ myUser, msg: "Registered" })
//           } else {
//             res.status(201).redirect("/login")
//           }
//         }).catch((err) => {
//           // Handle error
//           console.log(err)
//           res.status(500).json({ msg: "Failed to save user to database" })
//         })
//       }
//     });
//   }
// // console.log(myUser.password)
// })

app.post('/register', [
    check('fname').notEmpty().withMessage('First name is required.'),
    check('lname').notEmpty().withMessage('Last name is required.'),
    check('username').notEmpty().withMessage('Username is required.'),
    check('address').notEmpty().withMessage('Address is required.'),
    check('ph').notEmpty().withMessage('Phone number is required.'),
    check('password').notEmpty().withMessage('Password is required.'),
    check('type').notEmpty().withMessage('Type is required.'),
  ], (req, res) => {
    const content_type = req.headers['content-type']
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

            // return res.status(422).json({ errors: errors.array() });
            let errors = errors.array()
            // res.redi('sign up.ejs',{errors:errors.array()})
            res.redirect("/register")

      
    }else{
        return res.status(201).json({msg:"not empty"})
    }
  
    // Handle form submission
    // ...
  });
//logout
app.get("/logout",(req,res)=>{
    res.clearCookie("user_sid")
    res.redirect("back")
})

app.post('/charge',[
    check('number').isCreditCard(),
    check('expiration').matches(/^(0[1-9]|1[0-2])\/\d{2}$/).withMessage('expiration date is not correct'),
    check('cvv').isLength({ min: 3})],
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    try {
      const token = await stripe.tokens.create({
        card: {
          number: req.body.number,
          exp_month: req.body['expiration'].split('/')[0].trim(),
          exp_year:  req.body['expiration'].split('/')[1].trim(),
          cvc: req.body.cvv,
        },
      });
  
      const charge = await stripe.charges.create({
        amount: 2000, // Replace with your actual amount
        currency: 'usd',
        source: token.id,
      });
  
      res.send('Payment successful');
    } catch (err) {
      console.log(err);
      res.send('Payment failed');
    }
  });
// app.post('/store/check-out/payment', function(req, res) {
//     const name = req.body.name;
//     const cardNumber = req.body.number;
//     const cvv = req.body['security-code'];
//     const expMonth = req.body['expiration-month-and-year'].slice(0, 2);
//     const expYear = req.body['expiration-month-and-year'].slice(3);
  
//     stripe.tokens.create({
//       card: {
//         number: cardNumber,
//         exp_month: expMonth,
//         exp_year: expYear,
//         cvc: cvv,
//         name: name
//       }
//     }, function(err, token) {
//       if (err) {
//         // Handle error
//         console.log(err.message);
//         res.redirect('/payment');
//       } else {
//         stripe.charges.create({
//           amount: 2000, // Replace with your actual amount
//           currency: 'usd',
//           source: token.id
//         }, function(err, charge) {
//           if (err) {
//             // Handle error
//             console.log(err.message);
//             res.redirect('/payment');
//           } else {
//             // Handle success
//             console.log(charge);
//             res.redirect('/success');
//           }
//         });
//       }
//     });
//   });



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

