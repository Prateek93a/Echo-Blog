const router=require("express").Router();
const multer=require("multer");
const ejs=require("ejs");
const path=require("path");
const Userblogresponses = require('../models/user-blog-responses');

const Userblog = require('../models/user-blog');
//set storage engine
const storage=multer.diskStorage({
    destination:'./static/uploads/',
    filename:function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+ path.extname(file.originalname));
    }
})
//check file type
function checkFileType(file,cb){
    //allowed ext
    const filetypes=/jpeg|jpg|png|gif/;  //regex
    //check ext
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype=filetypes.test(file.mimetype);
    if(mimetype&&extname){
        return cb(null,true);
    }else{
        cb('Error:Images Only');
    }
}



//init upload
const upload=multer({
    storage:storage,
    limits:{fileSize:100000000},
    fileFilter:(req,file,cb)=>{
        checkFileType(file,cb);
    }
}).single('myimage')


const authCheck=(req,res,next)=>{
    //for checking if user has loggedin or not
    if(!req.user){
        res.redirect("/auth/login");
    }
    else{
        next();
    }
};

router.get("/write",authCheck,(req,res)=>{
    res.render("write.ejs", { user: req.user });
});




router.post('/upload-blog',authCheck,(req,res)=>{
    // res.send("test")
    upload(req,res,(err)=>{
        if(err){
            res.render('write.ejs',{msg:err,user: req.user });
        }
        else{
            if(req.file==undefined){
                res.render('write.ejs',{msg:'Error:no file selected',user: req.user });
            }
            else{
               
               let userblog= new Userblog;
               userblog.date=(new Date()).toDateString();
               userblog.author=req.user.username;
                userblog.googleId=req.user.googleId;
                userblog.title=req.body.title;
                userblog.shortdescription=req.body.description;
                userblog.blog=req.body.hiddenArea;
                userblog.bigPic=req.file;
                userblog.profilepic=req.user.thumbnail;
                req.body.tags.forEach((tag)=>{
                    userblog.tags.push(tag);
                })

               

              
                userblog.save().then((userblog)=>{
                    // console.log(userblog);
                    // console.log("Process Complete!");
                  
                    res.redirect("/display/display-blog/"+userblog.id);
                })
        
                
            }
        }
    })
})

module.exports=router;