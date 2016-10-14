var express = require('express');
var router = express.Router();
//var passport = require('passport');
//var jwt = require('express-jwt');

//var auth = jwt({secret:'SECRET', userProperty:'payload'});

// Get the service descriptor
router.get('/', function getRoot(req, res, next) {
  res.send({});
});

/*router.post('/register', function(req,res,next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message:"Veuillez remplir tous champs obligatoire SVP"});
  }

  var user= new User();

  user.username = req.body.username;
  user.setPassword(req.body.password);
  user.setEmail(req.body.email);

  user.save(function(err){
    if(err){return next(err);}

    return res.json({token: user.generateJWT()})
  });
});

router.post('/login', function(req,res,next){
  if (!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Veuillez remplir tous champs obligatoire SVP'});
  }

  passport.authenticate('local', function(err,user,info){
    if(err) {return next(err);}
    if(user){
      return res.json({token:user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req,res,next);
});*/

module.exports = router;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
