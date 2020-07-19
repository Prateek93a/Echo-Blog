const express=require("express");
const cookieSession = require('cookie-session');
const passport = require('passport');
const routes=require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const displayRoutes = require('./routes/display-routes');
const uploadRoutes = require('./routes/upload-routes');
const exploreRoutes = require('./routes/explore-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const bodyParser=require("body-parser");

const app=express();
app.set("view-engine","ejs");

// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// connect to mongodb
mongoose.connect(keys.mongodb.dbURI,{ useNewUrlParser: true },()=>console.log("connected"));
mongoose.Promise=global.Promise;

app.use("/auth",routes);
app.use("/profile",profileRoutes);
app.use("/upload",uploadRoutes);
app.use("/explore",exploreRoutes);
app.use("/display",displayRoutes);

app.use(express.static("static"));

app.get('/',(req,res)=>{
    if(req.user){
        res.redirect("/profile");
    }
    else{
    res.render("home.ejs",{user:req.user});}
})

app.listen(process.env.port||3000);
