const express = require('express')
const path = require('path')

const app = express()

app.use(express.static('build'))

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