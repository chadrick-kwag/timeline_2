const express = require('express')
const mongoose = require('mongoose')

const app = express();


mongoose.connect('mongodb://localhost/coronagov', { useNewUrlParser: true })

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

var eventSchema = new mongoose.Schema({
    date: Date,
    title: String,
    body: String,
    refs: Array
}

)

var eventModel = mongoose.model('events', eventSchema)


app.get('/api/getdata', (req, res) => {

    eventModel.find((err, results) => {
        if (err) return console.error(err)

        console.log(results)
        let jsonarr = []

        results.forEach(e => {
            let jsonobj = e.toJSON()
            delete jsonobj._id
            jsonarr.push(jsonobj)
        })
        console.log(jsonarr)
        res.json(jsonarr)
        return
    })

    // var data = ['1', '2']

    // res.json(data)
    // console.log("sent data")
})

app.listen(3001)
console.log('start listening')

module.exports