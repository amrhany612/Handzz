const mongoos = require('mongoose');


const storeSchema = new mongoos.Schema({
    name:{
        type:String,
        minLength:3,
        maxLength:12
    },
    logo:{
        type:String,
    },
    
    products:{
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
        amount:{
            type:Number,
        },
        img:{
            name:String,
            data:Buffer,
            contentType:String
        }
    },

    owner:{
        type:String
    }
})


const storeModel = mongoos.model("stores",storeSchema)
module.exports = storeModel
