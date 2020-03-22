const express = require('express')
const bodyparser = require('body-parser')


const config = require(__dirname + '/../config/config.json')



const app = express();
app.use(bodyparser.json())

// var eventSchema = new mongoose.Schema({
//     date: Date,
//     title: String,
//     body: String,
//     ref: Array
// })


var dummy_data=[
    {
        _id: '00001',
        date: (new Date(2020,1,10)).toDateString(),
        title: "title 1",
        body: "blahblahblah",
        ref: ['somelink']

    },
    {
        _id: "00002",
        date: (new Date(2020,0,10)).toDateString(),
        title: "title 2",
        body: "blahblah2",
        ref: []
    }
]

console.log(dummy_data)
console.log(new Date(2020,1,21))

console.log('newd:')
var newd = new Date(2020,1,21)

console.log(newd.toDateString())

app.get('/api/getdata', (req, res) => {
    console.log(dummy_data)
    res.json(dummy_data)

})


var port = config.data_port
app.listen(port)
console.log('start listening on port '+ port)

module.exports