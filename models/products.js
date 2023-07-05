const mongoos = require('mongoose');

const productSchema = new mongoos.Schema({
    type:{
        type:String,
        minLength:3,
        
    },
    id:{
        type:String,
    },
    name:{
        type:String,
        
    },
    storename:{
        type:String
    },
    price:{
        type:Number,

    },
    amount:{
        type:Number,
    },
    img:{
        type:String
    }
})


const productModel = mongoos.model("products",productSchema)
module.exports = productModel
