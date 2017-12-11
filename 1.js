var mysql = require('mysql')
var express = require('express')
var bodyParser = require('body-parser')
var jade = require('jade')
var app = express()
var user = express.Router()

app.use(bodyParser.urlencoded({}))
app.use('/user',user)

var pool = mysql.createPool({
	host:'127.0.0.1',
	user:'root',
	password:'123456',
	database:'shi',
	port:3306
})

user.post('/login',function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*')
	var user = req.body.user
	var pass = req.body.pass
    pool.getConnection(function(err,connection){
    	if(err){
    		console.log('connection::'+err)
    		return
    	}
    	connection.query('select * from login where user=?',[user],function(err,data){
    		if(err){
    		console.log('mysql::'+err)
    		return
    	    }
    		if(data == ''){
    			res.send('用户名不存在')
    		}else{
    			if(data[0].pass == pass){
    				//res.redirect('https://wangchaogang.github.io/')
                    res.send('list.html')
    			}else{
    				res.send('用户名或密码不对')
    			}
    		}
    		
    	})
    })
	
})
//注册
user.post('/login2',function(req,res){
	var user = req.body.user
	var pass = req.body.pass
    pool.getConnection(function(err,connection){
    	if(err){
    		console.log('connection::'+err)
    		return
    	}
    	
    	connection.query('select * from login where user=?',[user],function(err,data){
    		if(err){
    		console.log('mysql::'+err)
    		return
    	    }
    		if(data == ''){
    			connection.query('insert into login(user,pass) values(?,?)',[user,pass],function(err,data){
    				if(err){
    		console.log('mysql::'+err)
    		return
    	    }
					res.send('datum.html')
    				//res.send('注册成功')
    			})
    		}else{
    			res.send('用户名以存在')
    		}
    		
    	})
    })
	
})
//列表
user.post('/list',function(req,res){
	pool.getConnection(function(err,connection){
		if(err){
			console.log('connection：：'+err)
			return
		}
		var sql = 'select * from list'
		connection.query(sql,function(err,data){
			if(err){
			console.log('mysql：：'+err)
			return
		      }
			
			var srt = jade.renderFile('./1.jade',{pretty:true,arr1:data})
			res.send(srt)
			connection.end()
		})
	})
})


user.get('',function(req,res){
	var uid = req.query.uid
	pool.getConnection(function(err,connection){
		if(err){
			console.log('connection：：'+err)
			return
		}
		var sql = 'select * from list where uid=?'
		connection.query(sql,[uid],function(err,data){
			if(err){
			console.log('mysql：：'+err)
			return
		   }
			var srt = jade.renderFile('./2.jade',{pretty:true,texts:data[0]})
			res.send(srt)
			connection.end()
		})
	})
//	var srt = jade.renderFile('./2.jade',{pretty:true})
//			res.send(srt)
})
app.use(express.static('./'))
app.listen(8000,function(){
	console.log('ok')
})
