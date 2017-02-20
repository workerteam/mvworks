var express = require('express');
var router = express.Router();
//引入fs和文件上传模块multipary
var fs = require('fs');
var async = require('async');
var multiparty = require('multiparty');
var MongoClient = require('mongodb').MongoClient;
var	DB_CONN_STR = 'mongodb://localhost:27017/school';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index2', { title: 'Express',htmlView:'<b>htmlView</b>',email:req.session.email });
  console.log(req.session.email);
});
router.get('/login',function(req,res){
	res.render('login',{});
});
router.get('/list',function(req,res){
	res.render('list',{ title: 'Express',htmlView:'<b>htmlView</b>',email:req.session.email });
});
router.get('/register',function(req,res){
	// res.send('卵,这里是注册页面')
	res.render('register',{})
});
// router.get('/detail',function(req,res){
// 	res.render('detail',{title: 'Express',htmlView:'<b>htmlView</b>',email:req.session.email});
// });
router.get('/detail',function(req,res){
	var email = req.session.email || '';
	if(email){
		//初始化参数
		var pageNo = req.query.pageNo,
			pageNo = pageNo?pageNo:1,
			pageSize = 5,
			count = 0,
			totalPages = 0;
		var queryData = function(db,callback){
			var conn = db.collection('comment');

			//并行无关联
			async.parallel([
				function(callback){
					conn.find({}).toArray(function(err,results){
						if(err){
							return;
						}else{
							totalPages = Math.ceil(results.length/pageSize);
							count = results.length;
							callback(null,'');
						}
					});
				},
				function(callback){
					conn.find({}).sort({_id:-1}).skip((pageNo-1)*pageSize).limit(pageSize).toArray(function(err,results){
						if(err){
								return;
						}
						callback(null,results);
					});
				}
			],function(err,results){
				callback(results[1]);
			});		
		}
		MongoClient.connect(DB_CONN_STR,function(err,db){
			if(err){
				return;
			}else{
				queryData(db,function(results){
					// console.log(results);
					res.render('detail',{
						title: 'Express',
						htmlView:'<b>htmlView</b>',
						email:req.session.email,
						res:results,
						pageNo:pageNo,
						count:count,
						totalPages:totalPages});
					// res.render('comment',{res:results});
					db.close();
				});
			}
		});

	}
})
router.get('/lists', function(req, res){
	var pageNu = req.query.pageNu,
		pageNu = pageNu ? pageNu : 1,
		pageSize = 5,
		count = 0,
		totalPages = 0;


	var quertData = function(db, callback) {
		// 连接表
		var conn = db.collection('movie');

		async.parallel([
			function(callback) {
				conn.find({}).toArray(function(err, results) {
					if (err) {
						return;
					} else {
						count = results.length;
						totalPages = Math.ceil(count / pageSize);
						callback(null, '');
					}
				});
			},
			function(callback) {
				var obj = req.query;
				console.log(obj);
				for (var i in obj) {
					if (obj[i] === '') {
						delete obj[i];
					}
				}
				if (obj.pageNu) {
					delete obj.pageNu;
				}
				if (obj.year) {
					obj.year = {$gt:obj.year};
				}
				
				conn.find(obj).sort({average:-1}).skip((pageNu - 1) * pageSize).limit(pageSize).toArray(function(err, results){
					if (err) {
						return;
					}
					callback(null, results);
				});
				
			}
		], function(err, results) {
			callback(results[1]);
		});
	}

	MongoClient.connect(DB_CONN_STR, function(err, db) {
		if (err) {
			return;
		} else { 
			quertData(db, function(results) {
				console.log(results);
				var data = {
					pageSize:pageSize,
					pageNu:pageNu,
					totalPages:totalPages,
					res:results,
					count:count
				}
				res.render('lists', data);
			});	
		}
	});
});

router.get('/comment',function(req,res){
	res.render('register',{});
})
router.post('/uploadImg',function(req,res){
	//执行图片上传的路由
	var form = new multiparty.Form();
	// console.log(form);
	//打开图片浏览的功能
	// --->选择一张图片
	// --->将这图片放置到服务器的一个临时文件中
	// --->再把这个文件移动复制到指定的服务器项目目录中
	form.encoding = 'utf-8';
	//设置上传文件的存放目录
	form.uploadDir = './uploadtemp';
	//设置文件大小的限制
	form.maxFilesSize = 1024*1024*2;
	//对form表单数据内容进行解析操作
	form.parse(req,function(err,fileds,files){
		var uploadurl = './img/upload/';
		console.log(form);
		file = files['filedata'];
		originalFilename = file[0].originalFilename;//原始文件的名称
		tmpPath = file[0].path;

		var timestamp = new Date().getTime();
		uploadurl += timestamp + originalFilename;
		newPath = './public/' + uploadurl;

		var fileReadStream = fs.createReadStream(tmpPath);
		var fileWriteStream = fs.createWriteStream(newPath);

		fileReadStream.pipe(fileWriteStream);
		fileWriteStream.on('close',function(){
			fs.unlinkSync(tmpPath);
			res.send('{"err":"","msg":"'+ uploadurl +'"}');
		})

	});
});
router.get('/logout',function(req,res){
	req.session.destroy(function(err){
		res.redirect('/');
	});
});
module.exports = router;
