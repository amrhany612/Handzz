const owner = require("../models/ownerModel")
const store = require("../models/storeModel")
const bcrypt = require('bcrypt') 
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


exports.getLogin = (req,res)=>{
    res.render('adminlogin.ejs')
}

exports.adminDash =(req,res)=>{
    res.render('admindash.ejs')
}

exports.getDash = async (req,res)=>{
    username = req.body.adminname
    password = req.body.adminpassword
    if(username=="admin" && password=="admin"){
        res.redirect('/admin-dash')
    }else{
        res.redirect('/admin')
    }
}

exports.createAccount = (req,res)=>{
    res.render('createAccount.ejs')
}

exports.addOwner = (req,res)=>{
   
    const myOwner = new owner({
        fname:req.body.fname,
        lname:req.body.lname,
        username:req.body.username,
        address:req.body.address,
        ph:req.body.ph,
        password:req.body.password,
    })
    myOwner.save().then(()=>{
        res.status(200).redirect("/admin-dash")
    }).catch((err)=>{
        for (let e in err.errors) {
            res.status(400).send(err.errors)
        }
})
}


exports.getOwners = async(req,res)=>{
    const myData = await owner.find()
    let n = 1
    if(!myData){
        res
        .status(400)
        .redirect("/admin")
    }else{
    res
    .status(200)
    .render('ownersdash.ejs',{myData , n})
    }
}

exports.deleteOwner = async (req,res)=>{
    const id = req.params.id
   
    const Owner = await owner.findOneAndDelete({_id:id})
    res.redirect("/admin/owners")
     
}

exports.editPage = async(req,res)=>{
    const id = req.params.id
    const Owner = await owner.findOne({_id:id})
    if(Owner){
        res.status(200).render('editowner.ejs',{Owner})
    }else{
        res.status(404).redirect("/admin/owners")
    }
}

exports.editOwner = async(req,res)=>{
    const id = req.params.id
    const fname = req.body.fname
    const lname = req.body.lname
    const address = req.body.address
    const ph = req.body.ph
    const myOwner = await owner.findByIdAndUpdate(id,{fname:fname,lname:lname,address:address,ph:ph})
    if(myOwner){
        res.redirect('/admin/owners')
    }else{
        res.status(400).redirect('/admin-dash')
    }
}

exports.marketPage = (req,res)=>{
    res.status(200).render('createMarket.ejs')
}
exports.productPage = (req,res)=>{
    res.status(200).render('addproducts.ejs')
}

exports.addStore = async (req,res)=>{
    const myStore = new store({
        
        name:req.body.Marketname,
        logo:req.file.filename,
        owner:req.body.Ownername,
    
    })
    await myStore.save().then(()=>{
        res.status(200).redirect("/admin-dash")
    }).catch((err)=>{
        for (let e in err.errors) {
            res.status(400).send(err.errors)
        }
})
}

exports.addProduct = async (req,res)=>{
        const mystore = await store.findOneAndUpdate({name:req.body.Storename},{"$addToSet":{products:{
            type:req.body.type,
            name: req.body.name,
            price:req.body.price,
            amount:req.body.amount,
            img:req.file.filename
        }
        }
          })

        if(mystore){
            res.redirect("/admin-dash")
        }else{
            res.redirect("/create-account/market")
        }
 
}