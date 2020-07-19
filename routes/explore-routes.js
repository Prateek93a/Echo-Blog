const router = require('express').Router();
const Userblog = require('../models/user-blog');

router.get('/', (req, res) => {
    Userblog.find({},'author title profilepic date id bigPic.filename').then((blogArray)=>{
        res.render('explore.ejs', { user: req.user ,blogs:blogArray});
    })
   
});

router.get('/searchposts/',(req,res)=>{
    console.log(req.query);
    Userblog.find({
      title:/req.query.blogname/  
    },'author profilepic date title id bigPic.filename').then((resultblogArray)=>{
        res.send(JSON.stringify(resultblogArray)); 
    })
})

module.exports=router;