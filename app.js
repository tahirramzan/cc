var express = require('express')
var app = express()

app.use(express.static('public'))
app.use(express.static('/'))
app.get('/', function (req, res) {

    res.sendFile("index.html", {root: './public'});
})



app.listen(3000, function () {
    console.log('BlockChian Loyalty App is listening on port 3000!')
})

