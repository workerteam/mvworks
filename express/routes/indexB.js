var express=require('express');
var router=express.Router();

router.get('/',function(req,res,next){

})
router.get('/loginB',function(req,res){
	res.send('login page');
});
router.get('/registerB',function(req,res){
	res.send('register page');
})
router.get('/detail',function(req,res){
	res.send('detail page');
});
router.get('/list',function(req,res){
	res.send('list page');
});

module.exports=router;