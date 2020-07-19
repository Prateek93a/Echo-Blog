const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    blogId:String,
    writer:String,
        profilepic:String,
        date:String,
        content:String
    // responses: {
    //     writer:String,
    //     profilepic:String,
    //     date:String,
    //     content:String
    // }work on this
    
   // googleId:String, implement it so you can view someone else's profile
    
  
    
    
  
  
});

const Userblogresponse = mongoose.model('user-blog-response', userSchema);

module.exports = Userblogresponse;