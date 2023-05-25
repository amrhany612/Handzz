const localStrategy = require('passport-local').Strategy
const user = require("../models/usersModel")
const bcrypt = require('bcrypt')
function initialize(passport,getUserByUserName,getUserById){
    const authinticateUser = (username,password,done)=>{
        const User = getUserByUserName(username)


        if(user == null){
            return done(null,false,{message:"no user with that username"})
        }
        try{
            if(bcrypt.compare(password,User.password)){
                return done(null,User)
            }else{
                return done(null,false,{message:"password is incorrect"})
            }
        }
        catch(e){
            return done(e)
        }
    }

    passport.use(new localStrategy({},authinticateUser))
    passport.serializeUser(user,done=>{ done(null,user.id)})
    passport.deserializeUser(id,done =>{getUserById(id)})

}

module.exports = initialize