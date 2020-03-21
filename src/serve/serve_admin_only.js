const express = require('express')
const path = require('path')
const fs = require('fs')
var proxy = require('express-http-proxy');

const app = express()

const config = require(__dirname + '/../../config/config.json')

console.log(config)

const data_api_address = config.data_ip + ':' + config.data_port
console.log("data_api_address: " + data_api_address)
const port = config.admin_port


app.use(express.static('build'))
app.use('/api', proxy(data_api_address,{
    proxyReqPathResolver: function(req){
        console.log(req.url)
        return '/api' + req.url
    },
    proxyErrorHandler: function(err, res, next){
        console.log(err)
    }
}))

app.get('/', function(req, res){

    let sendpath = path.resolve('build/admin.html')
    res.sendFile(sendpath)
})

// app.get('/admin', function(req,res){
//     let sendpath = path.resolve('build/admin.html')
//     res.sendFile(sendpath)
// })

app.listen(port)
console.log("running admin app listening to " + port)