var http = require("http");
var formidable = require('formidable');
var util = require("util");
var fs = require("fs");
var sd = require("silly-datetime");
var path = require("path");

//数据库引用
var MongoClient = require('mongodb').MongoClient;

// 数据库地址
var SqlUrl = 'mongodb://localhost:27017/stduent';

//创建服务器
var server = http.createServer(function(req,res){

    //如果你的访问地址是这个，并且请求类型是post
    if(req.url == "/dopost" && req.method.toLowerCase() == "post"){

        //Creates a new incoming form.
        var form = new formidable.IncomingForm();

        //设置文件上传存放地址
        form.uploadDir = "./uploads";

        //执行里面的回调函数的时候，表单已经全部接收完毕了。
        form.parse(req, function(err, fields, files) {
            // if(err){
            //    throw err;
            // }
            // console.log(util.inspect({fields: fields, files: files}));

            //时间，使用了第三方模块，silly-datetime
            var ttt = sd.format(new Date(), 'YYYYMMDDHHmmss');

            // 随机数
            var ran = parseInt(Math.random() * 89999 + 10000);  

            // 图片后缀名
            var extname = path.extname(files.tupian.name);

            //执行改名
            var oldpath = __dirname + "/" + files.tupian.path;

            //新的路径由三个部分组成：时间戳、随机数、拓展名
            var newpath = __dirname + "/uploads/" + ttt + ran + extname;

            var imgUrl = "/uploads/" + ttt + ran + extname;
            

            //改名
            fs.rename(oldpath,newpath,function(err){
                if(err){
                    throw Error("改名失败");
                }
                // res.writeHead(200, {'content-type': 'text/html;chartset=UTF8'});
                // res.end("成功");
            });
            // 链接数据库
            MongoClient.connect(SqlUrl, function(err, db) {
                    if(err){
                        res.send("数据库连接失败");
                        return;
                    }
                    // 写入头部
                    res.writeHead(200,{'content-type': 'text/html;chartset:UTF8'});
                    //往数据插入数据
                    db.collection("stduent").insertOne({ "name":fields.name,"photo":fields.tupian},function(err,result){
                        if(err){
                            console.log("数据库写入失败")
                            return;
                        }  
                        console.log("恭喜，数据已经成功插入")
                        res.writeHead(200,{'content-type': 'text/html;chartset:UTF8'});
                        res.end(imgUrl)
                        //关闭数据库
                        db.close();
                    });
            });    
        });
    }else if(req.url == "/"){
        //呈递form.html页面
        fs.readFile("./form.html",function(err,data){
            res.writeHead(200, {'content-type': 'text/html'});
            res.end(data);
        })
    }else if(req.url == "/uploads"){
            console.log("uploads")
    }else{
        res.writeHead(404, {'content-type': 'text/html'});
        res.end("404");
    }
});

server.listen(3000,"127.0.0.1");