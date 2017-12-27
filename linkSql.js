/**
 *  1.连接到mogodb
 *  cmd -> mogodb --depath d:\mogosql
 *  cmd -> mongo
 */
var express = require("express");
//数据库引用
var MongoClient = require('mongodb').MongoClient;





var app = express();

//数据库连接的地址，最后的斜杠表示数据库名字
var shujukuURL = 'mongodb://localhost:27017/itcast';

app.get("/",function(req,res){
    //连接数据库，这是一个异步的操作
    MongoClient.connect(shujukuURL, function(err, db) {
        if(err){
            res.send("数据库连接失败");
            return;
        }
        res.write("恭喜，数据库已经成功连接 \n");
        db.collection("student").insertOne({"name":"我们就是这么厉害","age":22},function(err,result){
            if(err){
                res.send("数据库写入失败");
                return;
            }
            res.write("cd");
            res.end();
            //关闭数据库
            db.close();
        });
    });
});

app.listen(3000);

