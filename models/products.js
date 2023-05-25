const mongoos = require('mongoose');

const productSchema = new mongoos.Schema({
    type:{
        type:String,
        minLength:3,
        maxLength:12
    },
    name:{
        type:String,
        maxLength:12
    },
    price:{
        type:String,
        minLength:3,
        maxLength:12
    },
    img:{
        type:Buffer,
        contentType:String
    }
})


const productModel = mongoos.model("products",productSchema)
module.exports = productModel
