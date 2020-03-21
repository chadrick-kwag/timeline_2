const express = require('express')
const path = require('path')
const fs = require('fs')
var proxy = require('express-http-proxy');

const app = express()

const config = require(__dirname + '/../../config/config.json')

const rateLimit = require('express-rate-limit')
// import rateLimit from 'express-rate-limit'

var rateLimiter= rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: 'exceeded 5 requests in 1 min',
    headers: true
})


// console.log(config)

const data_api_address = config.data_ip + ':' + config.data_port
// console.log("data_api_address: " + data_api_address)
const port = config.port


app.use(express.static('devbuild'))
app.use("/api/",rateLimiter)

app.use('/api', proxy(data_api_address,{
    proxyReqPathResolver: function(req){
        // console.log(req.url)
        return '/api' + req.url
    },
    proxyErrorHandler: function(err, res, next){
        console.log(err)
    }
}))

app.get('/', function(req, res){

    let sendpath = path.resolve('devbuild/template.html')
    console.log(sendpath)
    res.sendFile(sendpath)
})

app.listen(port)
console.log("app listening to " + port)