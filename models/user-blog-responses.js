const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    blogId:String,
    writer:String,
    profilepic:String,
    date:String,
    content:String
});

const Userblogresponse = mongoose.model('user-blog-response', userSchema);

module.exports = Userblogresponse;
