const express = require('express');
const router = express.Router();
const indexController = require("../controller/indexController")
const userController = require("../controller/userController")
const ownerController = require("../controller/ownerController")
module.exports = router;
router
.route("/")
.get(indexController.indexPage)

router.get("/login/user",userController.loginPage)
router.post("/login/user",userController.loginUser)

router.get("/login/owner",ownerController.loginOwnerPage)

router.get("/register",userController.registerPage)
router.post("/register",userController.addUser)