const express = require('express'),
app = express(),
request = require('request'),
bodyParser = require('body-parser'), 
bitCore = require('bitcore-lib');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set("view engine","ejs");

function getPrice(callback){
    request({
        url: "https://blockchain.info/ticker",
        json: true
    }, function(error,response,body){
        callback(body.KRW.last)
    });
}

function wallet(uInput,callback){
    var input = new Buffer(uInput);
    var hash = bitCore.crypto.Hash.sha256(input);
    var bn = bitCore.crypto.BN.fromBuffer(hash);
    var privateKey = new bitCore.PrivateKey(bn).toWIF();
    var address = new bitCore.PrivateKey(bn).toAddress();
    callback(privateKey,address);
}


app.get('/', function(req,res){
    getPrice(function(lastPrice){
        res.render('index', {
            lastPrice: lastPrice
        });
    })
})
app.get('/bitcoin', function(req,res){
    getPrice(function(lastPrice){
        res.render('bitcoin', {
            lastPrice: lastPrice
        });
    })
})
app.get('/converter', function(req,res){
    getPrice(function(lastPrice){
        res.render('converter', {
            lastPrice: lastPrice
        });
    })
})


app.post('/wallet', function(req,res){
    var source = req.body.source;
    console.log(source);
    wallet(source, function(privateKey, address){
        res.send("Wallet of " + source + "<br>Address: " + address + "<br>Private Key: " + privateKey );
    });
})

app.get('/block', function(req,res){
    res.send("Current Block height: " + btcBlocks);
})

app.listen(3000, function(){
    console.log("Server listening on port: 3000");
})