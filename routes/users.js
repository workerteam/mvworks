var express = require('express');
var router = express.Router();
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/school';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//suers/login
// router.get('/login',function(req,res){
// 	var email = req.param('email');
// 	var password = req.param('password');
// 	var findData =function(db,callback){
// 		var conn = db.collection('user');
// 		var data = {email:email,password:password};
// 		conn.find(data).toArray(function(err,results){
// 			if(err){
// 				return;
// 			}else{
// 				callback(results);
// 			}
// 		});
// 	}
// 	MongoClient.connect(DB_CONN_STR,function(err,db){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			findData(db,function(results){
// 				// console.log(results)
// 				if(results.length > 0){
// 					req.session.email = results[0].email;
// 					res.redirect('/detail');
// 				}else{
// 					res.send('用户名或者密码错误，请重新输入');
// 				}
// 				db.close();
// 			})
			
// 		}
// 	})
// });
router.get('/login',function(req,res){
	// console.log('/users/login');
	// res.send('/users/login');
	console.log(req.query.email,req.query.password);
});
router.post('/login',function(req,res){
	//console.log(req.body.email,req.body.password);
	var email=req.body.email;
	var password=req.body.password;
	var findData=function(db,callback){
		var conn=db.collection('user');
		var data={email:email,password:password};
		conn.find(data).toArray(function(err,results){
			if(err){
				return;
			}console.log(results);
			callback(results);
		})
	}
	MongoClient.connect(DB_CONN_STR,function(err,db){
		if(err){
			console.log(err);
		}else{
			findData(db,function(results){
				if(results.length>0){

					//登录成功以后,将用户名存储到对象里面去,其它地方就可以是用了
					req.session.email=results[0].email;
					// res.send('login success');
					res.redirect('/');
				}else{
					res.send('login falil');
				}
				db.close();
			})
		}
		// if(err){
		// 	console.log(err);
		// }else{
		// 	console.log('connect success');
		// 	var data={email:req.body.email,password:req.body.password};
		// 	var conn=db.collection('user');
		// 	conn.find(data).toArray(function(err,results){
		// 		if(err){
		// 			return;
		// 		}else{
		// 			console.log(results);
		// 			if(results.length>0){
		// 				res.send('登录成功');
		// 			}else{
		// 				res.send('没有该用户名或密码错误');
					
		// 			}
		// 			// res.send('查询数据成功');
		// 		}
		// 	});

		
	})
});
router.post('/register',function(req,res){
	var email=req.param('email');
	var password=req.param('password');
	
	var insertData=function(db,callback){
		var conn=db.collection('user');
		var data=[{email:email,password:password}];
		
		
		conn.insert(data,function(err,results){
			if(err){
				return;
			}console.log(results);
			callback(results);
		})
	}
	MongoClient.connect(DB_CONN_STR,function(err,db){
		if(err){
			return;
		}else{
			insertData(db,function(results){
				// res.send('注册成功');
				db.close();
				res.redirect('/');
			})
		}
	})
})
// router.post('/login',function(req,res){
// 	console.log(req.param('email'),req.param('password'));
// })
module.exports = router;
