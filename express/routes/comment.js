var express=require('express');
var router=express.Router();
var MongoClient=require('mongodb').MongoClient;
var DB_CONN_STR='mongodb://localhost:27017/school';
var async=require('async');

router.post('/submit',function(req,res){
	var email=req.session.email || '';
	if(email){
		var title=req.body.title;
		var content=req.body.content;
		
		var insertData=function(db,callback){
			//连接表
			var conn=db.collection('comment');
			//获取参数
			var data=[{title:title,content:content,email:email}];
			//插入数据
			conn.insert(data,function(err,results){
				if(err){
					return;
				}
				callback(results);
			})
		}
		MongoClient.connect(DB_CONN_STR,function(err,db){
			if(err){
				return;
			}else{
				insertData(db,function(results){
					res.redirect('/');
					db.close();
				})
			}
		})
	
}else{
	res.send("<script>alert('session过期了,请重新登录');location.href='/login';</script>");

}
});

module.exports=router;