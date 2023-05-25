const productModel = require("../models/products")

exports.getProduct = async(req,res)=>{
    res.render("gallery.ejs")
}