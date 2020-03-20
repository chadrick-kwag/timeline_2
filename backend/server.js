const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')

const app = express();
app.use(bodyparser.json())


mongoose.connect('mongodb://localhost/coronagov', { useNewUrlParser: true })

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

var eventSchema = new mongoose.Schema({
    date: Date,
    title: String,
    body: String,
    ref: Array
})

var eventModel = mongoose.model('events', eventSchema)



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

    // eventModel.findById(id, (err,doc)=>{
    //     if(err){
    //         return res.sendStatus(500)
    //     }

    //     console.log("found doc: ")
    //     console.log(doc)





    //     doc.date = req.body.date
    //     doc.title = req.body.title
    //     doc.body = req.body.body

    //     console.log("req refs: ")
    //     console.log(req.body.refs)
    //     doc.ref = req.body.refs

    //     console.log("doc after changing attributes")
    //     console.log(doc)

    //     doc.save((err)=>{
    //         if(err){
    //             console.log("err while saving updated doc")
    //             console.log(err)
    //             return res.sendStatus(500)
    //         }

    //         // console.log("updated doc:")
    //         // console.log(product)

    //         res.sendStatus(200)
    //     })

    // })
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

app.listen(3001)
console.log('start listening on port 3001')

module.exports