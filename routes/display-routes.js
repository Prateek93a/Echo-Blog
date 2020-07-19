const router=require("express").Router();
const Userblog = require('../models/user-blog');
const UserProfile = require('../models/user-profile');
const Userblogresponses = require('../models/user-blog-responses');



const authCheck=(req,res,next)=>{
    //for checking if user has loggedin or not
    if(!req.user){
        res.redirect("/auth/login");
    }
    else{
        next();
    }
};


router.get('/display-blog/:id',(req,res)=>{
   
    Userblog.findOne({_id:req.params.id}).then((blog)=>{
        Userblogresponses.find({blogId:(blog._id).toString()},).sort({_id: 'desc'}).then((responseblogArray)=>{ 
            UserProfile.findOne({googleId:blog.googleId}).then((userprofile)=>{
            Userblog.find({}).then((blogArray)=>{
                UserProfile.findOne({googleId:req.user.googleId}).then((user)=>{
                
                    res.render("blog-display.ejs",{user:user,userblog:blog,favorites:user.favorites,likes:blog.likes,userprofile:userprofile,blogs:blogArray,responses:responseblogArray});

                })
               
            })
          
        })

        })
       
       
    })
});

router.get('/post-comment',authCheck,(req,res)=>{
 
    new Userblogresponses({
        blogId:req.query.blogid,
        
            writer:req.query.username,
        date:req.query.date,
        profilepic:req.query.profilepiclink,
        content:req.query.responseText

    }).save().then((response)=>{

        res.send(JSON.stringify(response));
    })
})


router.get('/like',authCheck,(req,res)=>{
    
   Userblog.findOneAndUpdate({_id:req.query.blogid}, { "$addToSet": { "likes": req.user.googleId.toString() } }).then(()=>{
    res.send();
      
   })
})



router.get('/favorite',authCheck,(req,res)=>{
    
    UserProfile.findOneAndUpdate({googleId:req.user.googleId}, { "$addToSet": { "favorites": req.query.blogid } }).then(()=>{
     res.send();
       
    })
 })


router.get('/follow',authCheck,(req,res)=>{
  
    UserProfile.findOneAndUpdate({email:req.query.email}, { "$addToSet": { "followers": req.user.email } }).then(()=>{
    UserProfile.findOneAndUpdate({email:req.user.email},{ "$addToSet": { "following": req.query.email } }).then(()=>{
        res.send();
    })
       
    })
 })
 router.get('/unfollow',authCheck,(req,res)=>{
 
    UserProfile.findOneAndUpdate({email:req.query.email}, { "$pull": { "followers": req.user.email  } }).then(()=>{
    UserProfile.findOneAndUpdate({email:req.user.email},{ "$pull": { "following": req.query.email  } }).then(()=>{
        res.send();
    })
       
    })
 })

module.exports=router;

