const bcrypt = require('bcrypt');
const mongoos = require('mongoose');

const userSchema = new mongoos.Schema({
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
    address:{
        type:String,
        lowercase:true,
        // required:true,
        trim:true,
        minLength:3,
        maxLength:40
    },
    ph:{
        type:String,
        min:11,
        // max:12,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
        minLength:8,
        
    },
    type:{
        type:String,
    }


})

userSchema.pre("save",function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password=bcrypt.hashSync(this.password,10);
    next();
})

const userModel = mongoos.model("users",userSchema)
module.exports = userModel
