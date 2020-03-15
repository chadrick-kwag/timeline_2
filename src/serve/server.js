const express = require('express')
const path = require('path')
var proxy = require('express-http-proxy');

const app = express()

app.use(express.static('build'))
app.use('/api', proxy('localhost:3001',{
    proxyReqPathResolver: function(req){
        console.log(req.url)
        return '/api' + req.url
    },
    proxyErrorHandler: function(err, res, next){
        console.log(err)
    }
}))

app.get('/', function(req, res){

    let sendpath = path.resolve('build/template.html')
    console.log(sendpath)
    res.sendFile(sendpath)
})

app.get('/admin', function(req,res){
    let sendpath = path.resolve('build/admin.html')
    res.sendFile(sendpath)
})

app.listen(8080)
console.log("app listening to 8080")