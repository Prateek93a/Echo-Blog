const router=require("express").Router();
const User = require('../models/user-model');
const Userprofile = require('../models/user-profile');
const Userblog = require('../models/user-blog');
const authCheck=(req,res,next)=>{
    //for checking if user has loggedin or not
    if(!req.user){
        res.redirect("/auth/login");
    }
    else{
        next();
    }
};

router.get("/",authCheck,(req,res)=>{
    Userprofile.findOne({'googleId':req.user.googleId}).then((userprofile)=>{
        if(!userprofile){
            new Userprofile( {googleId: req.user.googleId,
                username: req.user.username,
                thumbnail: req.user.thumbnail,
                email:req.user.email}).save().then((newUserprofile)=>{
                    res.redirect("/profile");
                })
        }
    
        
        else{
             Userblog.find({'googleId':req.user.googleId},'shortdescription date title id bigPic.filename').then((userblogs)=>{
                res.render("profile.ejs", { user: userprofile,userblogs:userblogs });
    

          
        })
    
    }
    })
})


router.get("/works/:googleid",authCheck,(req,res)=>{
  // console.log(req.params.googleid)
    Userblog.find({'googleId':req.params.googleid},'shortdescription date title id bigPic.filename').then((userblogs)=>{
      //  console.log(userblogs)
       res.send(userblogs);
})
})


router.get("/favorites/:googleid",authCheck,(req,res)=>{
    Userprofile.findOne({googleId:req.params.googleid},'favorites').then((favoritesobj)=>{
        let favoritesArray=favoritesobj.favorites;
        var j=0;
       // console.log(favoritesArray);
        var resultblogsArray=[];
        for(i=0;i<favoritesArray.length;i++){
            let favoritePostId=favoritesArray[i];
          //  console.log(favoritePostId)
                        Userblog.find({_id:favoritePostId},'shortdescription date title id bigPic.filename').then((favoritePost)=>{
              //  console.log(favoritePost[0])
              j++;
            
                resultblogsArray.push(favoritePost[0])
               // console.log(favoritesArray.length,i)
                if(j>=favoritesArray.length){
                    i=favoritesArray.length+1
                    // console.log('hi')
                    // console.log(resultblogsArray)
                    res.send(resultblogsArray);
                }
            })
        }
      
    })
//     console.log(req.params.googleid)
//      Userblog.find({'googleId':req.params.googleid},'shortdescription date title id bigPic.filename').then((userblogs)=>{
//          console.log(userblogs)
//         res.send(userblogs);
//  })
 })




router.get("/subscriptions/:googleid",authCheck,(req,res)=>{
  
   
    let following_profiles=[];
     Userprofile.find({'googleId':req.params.googleid},'following').then((followings)=>{
     
         var k=0;
         let followingObj=followings[0];
         let following=followingObj.following
    
         for(i=0;i<following.length;i++){//a simple sol to i<=following.length which caused an additional call to .then method, that caused'can't set headers after they are sent' but mind that here we needed k>=length and not just equal to ,think when we have 0 as length
            // console.log('i=',i)
            Userprofile.find({email:following[i]}, 'thumbnail username followers ').then((profile)=>{
                k++;

          //  console.log(profile)
                following_profiles.push(profile[0]);
                if(k>=following.length){
                 //   console.log('k=',k)

                    i=following.length+1;
                   
                    res.send(following_profiles);
                  
                }
            })
         }
       
      
 })
 })
 


router.post("/personal",authCheck,(req,res)=>{
   
    Userprofile.findOne({'googleId':req.user.googleId}).then((userprofile)=>{
      
        
            
            userprofile.description=req.body.description;
            userprofile.location=req.body.location;
            userprofile.profession=req.body.profession;
            userprofile.save().then(()=>{
                res.redirect("/profile");
            })
        })

    })





module.exports=router;

