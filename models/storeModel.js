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
            type:Number,
           
        },
        amount:{
            type:Number,
        },
        img:{
            type:String
        }
    },

    owner:{
        type:String
    }
})


const storeModel = mongoos.model("stores",storeSchema)
module.exports = storeModel
