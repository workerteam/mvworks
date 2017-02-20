var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var	DB_CONN_STR = 'mongodb://localhost:27017/school';

router.post('/submit',function(req,res){
	var email = req.session.email || '';
	if(email){
		var content = req.param('content');
		var insertData = function(db,callback){
			//链接表
			var conn = db.collection('comment');
			//获取参数
			var data = [{email:email,content:content}];

			//插入数据
			conn.insert(data,function(err,results){
				if(err){
					return;
				}
				callback(results);
			});
		}
		var queryData = function(db,callback){
			var conn = db.collection('comment');
			conn.find().toArray(function(err,results){
				if(err){
					return;
				}
				callback(results);
				
			});
		}
		MongoClient.connect(DB_CONN_STR,function(err,db){
			if(err){
				return;
			}else{
				insertData(db,function(results){
					//评论完回详情页
					res.redirect('/detail');
					console.log(results);
					// MongoClient.connect(DB_CONN_STR,function(err,db){
					// 	if(err){
					// 		return;
					// 	}else{
					// 		queryData(db,function(results){
					// 			console.log(results);
					// 			res.render('detail',{title: 'Express',htmlView:'<b>htmlView</b>',email:req.session.email,res:results});
					// 			db.close();
					// 		});
					// 	}
					// });
					db.close();
					
				});

			}
		});

	}else{
		res.send("<script>alert('用户信息已过期，请重新登陆');location.href='/login';</script>");
	}
	
});
// router.get('/logout',function(req,res){
// 	req.session.destroy(function(err){
// 		res.redirect('/detail');
// 	});
// });
// router.get('/comment',function(req,res){
// 	var email = req.session.email || '';
// 	if(email){
// 		var queryData = function(db,callback){
// 			var conn = db.collection('comment');
// 			conn.find().toArray(function(err,results){
// 				if(err){
// 					return;
// 				}
// 				callback(results);
				
// 			});
// 		}
// 		MongoClient.connect(DB_CONN_STR,function(err,db){
// 			if(err){
// 				return;
// 			}else{
// 				queryData(db,function(results){
// 					console.log(results);
// 					res.render('comment',{title: 'Express',htmlView:'<b>htmlView</b>',email:req.session.email,res:results});
// 					// res.render('comment',{res:results});
// 					db.close();
// 				});
// 			}
// 		});

// 	}
// })
module.exports = router;