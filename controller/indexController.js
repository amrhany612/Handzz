const store = require("../models/storeModel")
exports.indexPage = (req,res)=>{
    const isAuthenticated = req.session.isAuthenticated || false;
    res.render("index.ejs",{isAuthenticated})
}

exports.getStore = async(req,res)=>{
    const id = req.params.id
    let i = 0
    const Store = await store.findOne({_id:id})
    if(Store){
        res.render('store/index.ejs',{Store,i})
    
    }else{
        res.redirect("/")
    }

}