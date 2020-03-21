const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')

const config = require(__dirname + '/../config/config.json')

console.log(config)

const app = express();
app.use(bodyparser.json())

var mongo_url = "mongodb://"+config.mongodb_ip + '/' + config.dbname
mongoose.connect(mongo_url, { useNewUrlParser: true })

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

var eventSchema = new mongoose.Schema({
    date: Date,
    title: String,
    body: String,
    ref: Array
})


var eventModel = mongoose.model(config.collection_name, eventSchema)



app.put('/api/getdata', (req, res) => {
    console.log(req.body)
    console.log(req.data)

    // find document with id

    let id = req.body.id

    eventModel.update({ _id: id }, {
        "$set": {
            title: req.body.title,
            body: req.body.body,
            date: req.body.date,
            ref: req.body.refs
        }

    }, (err, raw) => {
        if (err) {
            console.log(err)
            return res.sendStatus(500)
        }
        console.log("after eventmodel update")
        console.log(raw)

        res.sendStatus(200)
    })

})

app.delete('/api/getdata/:id', (req, res) => {
    console.log(req.params)
    console.log(req.body)
    console.log(req.data)

    let del_id = req.params.id

    eventModel.deleteOne({ _id: del_id }, function (err) {
        if (err) {
            console.log('delete fail')
            return res.sendStatus(500)

        }
        else {
            console.log('delete success')
            return res.sendStatus(200)
        }
    })


})

app.post('/api/getdata', (req, res) => {
    // console.log(req.method)
    // console.log(req.body)
    let data = req.body

    console.log(data)
    data['ref'] = data.refs

    let newdoc = new eventModel(data)
    console.log(newdoc)

    newdoc.save(function (err, doc) {
        if (err) return console.log(err)

        console.log('added to db. doc = ' + doc)
    })

    res.sendStatus(200)
})

app.get('/api/getdata', (req, res) => {

    eventModel.find((err, results) => {
        if (err) return console.error(err)

        res.json(results)
        return
    })

})


var port = config.data_port
app.listen(port)
console.log('start listening on port '+ port)

module.exports