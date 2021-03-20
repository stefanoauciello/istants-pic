const express = require('express')
const app = express()

app.get('/photos', function (req, res) {
    res.status(200).send('HI');
})

app.post('/upload-photo', function (req, res) {
    res.status(200).send('HI');
})

app.listen(3000)