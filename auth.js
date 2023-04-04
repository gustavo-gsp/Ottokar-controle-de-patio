const Bcrypt = require('bcrypt');
const User = require('./models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const name ="";
const func = "";
module.exports = function(passport){
    async function findUSer (user){
        return await User.findOne({user: user})
}
async function findById (id){
    return await User.findOne({_id: id});
}
passport.serializeUser((user, done) =>{
    done(null, user._id);
});
passport.deserializeUser( async(id, done)=>{
    try{
        const users = await User.findOne({_id: id});
        const user = users._id;
        done(null, user);
    }catch (err) {
        console.log(err)
        return done(err, null);
    }
});
passport.use(new LocalStrategy({
    usernameField: 'user',
    passwordField: 'password'
},
async (userName, password, done)=>{
    try{
        const user = await User.findOne({user: userName});
        if(!user) return done(null, false);
        
        const isvalid = Bcrypt.compareSync(password, user.password);

        if(!isvalid) return done(null,false);
    
        return done(null, user);
    }catch (err) {
        console.log(err)
        return done(err, false);
    }
}))
}



