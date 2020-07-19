const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    author:String,
    googleId:String,
    title: String,
    shortdescription: String,
    blog:String,
    bigPic: Object,
    profilepic:String,
    date:String,
    tags:[String],
    likes:{
        type:[String],
        default:[]
    }
});

const Userblog = mongoose.model('user-blog', userSchema);

module.exports = Userblog;