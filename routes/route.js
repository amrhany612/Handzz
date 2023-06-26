const express = require('express');
const app = express()
const path = require('path')
const router = express.Router(); 
const indexController = require("../controller/indexController")
const userController = require("../controller/userController")
const ownerController = require("../controller/ownerController")
const productController = require("../controller/productController");
const adminController = require("../controller/adminController")
const session = require('express-session')
const cookies = require('cookie-parser')
const multer = require('multer')
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public/logo");
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
});
const upload = multer({storage:storage});
module.exports = router;
let succesChecker = (req,res,next)=>{
    if(req.session.user&&req.cookies.user_sid){
        next()
    }else{
        res.redirect('/form')
    }
}


router.get("/login/owner",ownerController.loginOwnerPage)

// router.post("/register",userController.addUser)
router.get("/form",ownerController.getForm)
router.post("/form",ownerController.getInfo)
router.get("/success",ownerController.successPage)
router.get("/owner",ownerController.getPage)
router.post("/owner",ownerController.addowner)

router.get("/clothes",productController.getProduct)
router.get("/admin-dash",adminController.adminDash)
router.get("/admin",adminController.getLogin)
router.post("/admin",adminController.getDash)
router.get("/create-account",adminController.createAccount)
router.post("/create-account",adminController.addOwner)
router.get("/admin/owners",adminController.getOwners)
router.post("/admin/owners/:id",adminController.deleteOwner)
router.get("/admin/owners/:id/edit",adminController.editPage)
router.post("/admin/owners/:id/edit",adminController.editOwner)
router.get("/create-account/market",adminController.marketPage)
router.post("/create-account/market",upload.single("image"),adminController.addStore)
router.get("/products",adminController.productPage)
router.post("/products",upload.single("image"),adminController.addProduct)
router.get("/store/:id",indexController.getStore)






