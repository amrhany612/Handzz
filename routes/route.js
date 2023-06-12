const express = require('express');

const router = express.Router(); 
const indexController = require("../controller/indexController")
const userController = require("../controller/userController")
const ownerController = require("../controller/ownerController")
const productController = require("../controller/productController");
const session = require('express-session')
const cookies = require('cookie-parser')
module.exports = router;
let succesChecker = (req,res,next)=>{
    if(req.session.user&&req.cookies.user_sid){
        next()
    }else{
        res.redirect('/form')
    }
}





// router
// .route("/")
// .get(indexController.indexPage)

// router.get("/login",sessionchecker,userController.loginPage)
// router.post("/login/user",userController.loginUser)


router.get("/login/owner",ownerController.loginOwnerPage)

// router.get("/register",userController.registerPage)
// router.get("/dash/:id",ownerController.getDash)
router.post("/register",userController.addUser)
router.get("/form",ownerController.getForm)
router.post("/form",ownerController.getInfo)
router.get("/success",ownerController.successPage)
router.get("/owner",ownerController.getPage)
router.post("/owner",ownerController.addowner)
// router.get("/dash",ownerController.getDash)
router.get("/clothes",productController.getProduct)