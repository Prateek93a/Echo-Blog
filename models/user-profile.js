const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String,
    email:String,
    thumbnail: String,
   // bigPic:String,
    description:String,
    location:String,
    followers:{
        type:[String],
        default:[]
    },
    following:{
        type:[String],
        default:[]
    },
    favorites:{
        type:[String],
        default:[]
    },
    profession:String
});

const Userprofile = mongoose.model('user-profile', userSchema);

module.exports = Userprofile;