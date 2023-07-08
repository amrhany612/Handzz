const express = require('express');
const app = express()

const path = require('path')
const router = express.Router(); 
const indexController = require("../controller/indexController")
const userController = require("../controller/userController")
const ownerController = require("../controller/ownerController")
const productController = require("../controller/productController");
const adminController = require("../controller/adminController")
const storeController = require("../controller/storeController")
const adminChecker = adminController.adminChecker
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MemoryStore = require('memorystore')(session)

const multer = require('multer')
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public/logo");
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    },
    
});
const upload = multer({storage:storage});
const storage2 = multer.memoryStorage()
const upload2 = multer({storage:storage2})
const storage3 = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public/products");
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    },
    
});
const upload3= multer({storage:storage3});

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

let sessionchecker3 = (req,res,next)=>{
    if(!req.session.user&&!req.cookies.user_sid){
        res.redirect("/login/owner")
    }else{
        next()
    }

}
module.exports = router;
let succesChecker = (req,res,next)=>{
    if(req.session.user&&req.cookies.user_sid){
        next()
    }else{
        res.redirect('/form')
    }
}


router.post("/",indexController.contact)
router.get("/login/owner",ownerController.loginOwnerPage)

// router.post("/register",userController.addUser)
router.get("/form",ownerController.getForm)
router.post("/form",ownerController.getInfo)
router.get("/success",ownerController.successPage)
router.get("/owner",ownerController.getPage)
router.post("/owner",ownerController.addowner)

router.get("/clothes",productController.getProduct)
router.get("/admin-dash",adminChecker,adminController.adminDash)
router.get("/admin",adminController.getLogin)
router.post("/admin",adminController.getDash)
router.get("/create-account",adminController.createAccount)
router.post("/create-account",adminController.addOwner)
router.get("/admin/owners",adminController.getOwners)
router.post("/admin/owners/:id",adminController.deleteOwner)
router.get("/admin/owners/:id/edit",adminController.editPage)
router.post("/admin/owners/:id/edit",adminController.editOwner)
router.get("/create-account/market",adminController.marketPage)
router.post("/create-account/market",upload2.single("image"),adminController.addStore)
router.get("/products",adminController.productPage)
router.post("/products",upload3.single("image"),adminController.addProduct)
router.get("/store/:id",indexController.getStore)
router.get("/store/:id/product-details/:name",storeController.getProduct)
// router.post("/store/:id/product-details/:name",storeController.addToCart)
router.post("/store/check-out",storeController.checkOutPage)
router.get('/store/check-out/payment',storeController.payementPage)
// router.post('/store/check-out/payment#parentHorizontalTab2',storeController.payementPage2)



