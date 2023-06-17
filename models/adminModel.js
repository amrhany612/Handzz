const bcrypt = require('bcrypt');
const mongoos = require('mongoose');

const adminSchema = new mongoos.Schema({
    fname:{
        type:String,
        lowercase:true,
        // required:true,
        trim:true,
        minLength:3,
        maxLength:12
    },
    lname:{
        type:String,
        lowercase:true,
        // required:true,
        trim:true,
        minLength:3,
        maxLength:12
    },
    username:{
        type:String,
        // required:true,
        trim:true,
        minLength:8,
        maxLength:30,
        unique:true
    },
    ph:{
        type:Number,
       
    },
    email:{
        type:String,
    },
    password:{
        type:String,
        minLength:8,
        
    },
    type:{
        types:String
    }

})

adminSchema.pre("save",function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password=bcrypt.hashSync(this.password,10);
    next();
})

const adminModel = mongoos.model("admins",adminSchema)
module.exports = adminModel
