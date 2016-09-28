/**
 * Created by xicunhan on 27/09/2016.
 */
var express = require('express');
var router = express.Router();
var multer = require('multer');


//difinir storage
var storeImg = multer.diskStorage({
  destination: function(req,file,callback) {
    callback(null, './upload/images');
  },
  filename: function(req,file, callback){
    callback(null, file.filename + '-' +Date.now()+'.'+file.originalname);
  }
});



var uploadImg = multer({storage: storeImg}).single('userPhoto');

router.post('/upload',function(req,res){
  uploadImg(req, res, function(err){
    if(err){
      return res.end("Error uploading file."+"");
    }
    res.end("File is uploaded");
  });
});

module.exports = router;
