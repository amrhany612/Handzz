const mongoos = require('mongoose');

const formSchema = new mongoos.Schema({
    type:{
        type:String,
        maxLength:12
    },
    storeName:{
        type:String
    }
    ,
    ph:{
        type:String
    }
})


const formModel = mongoos.model("storeform",formSchema)
module.exports = formModel
