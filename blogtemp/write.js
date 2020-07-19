const router=require("express").Router();
const multer=require("multer");
const ejs=require("ejs");
const path=require("path");
const bodyParser=require("body-parser");
//set storage engine
const storage=multer.diskStorage({
    destination:'./public/upload/',
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



const router=express();
router.set("view engine",'ejs');

router.use(express.static('./public'));
router.use(bodyParser.json());
router.get("/",(req,res)=>{
   res.render('index')
})



router.post('/upload',(req,res)=>{
    // res.send("test")
    upload(req,res,(err)=>{
        if(err){
            res.render('index',{msg:err});
        }
        else{
            if(req.file==undefined){
                res.render('index',{msg:'Error:no file selected'});
            }
            else{
                res.render('index',{msg:'File uploaded',file:`upload/${req.file.filename}`,text:req.body.title})
            }
        }
    })
})
module.exports=router;