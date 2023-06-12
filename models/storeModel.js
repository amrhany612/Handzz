const mongoos = require('mongoose');
const productSchema = require("./products")
const ownerSchema = require("./ownerModel")

const storeSchema = new mongoos.Schema({
    name:{
        type:String,
        minLength:3,
        maxLength:12
    },
    logo:{
        type:Buffer,
        contentType:String
    },
    
    // products:productSchema,

    owner:ownerSchema
})


const storeModel = mongoos.model("stores",storeSchema)
module.exports = storeModel
