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
        name:String,
        data:Buffer,
        contentType:String
    }
})


const productModel = mongoos.model("products",productSchema)
module.exports = productModel
