const express = require('express')
const path = require('path')
const logger = require('morgan')
const http = require('http')
const app = express()
const port = 3000

const publicPath = path.join(__dirname, 'public')

app.use(logger('short'))
app.use(express.static(publicPath))

app.get('/', function (request, response) {
    response.end('Welcome to my root page')
})

app.get('/miss', function (request, response) {
    response.redirect('/hello/wonjo')
})
app.get('/hello/:who', function (request, response) {
    response.end('Hello, ' + request.params.who)
})

app.get('/about', function (request, response) {
    response.end('Welcome to my about page')
})

app.get('/weather', function (request, response) {
    response.json({
        location: 'Seoul',
        degree: '20',
    })
})

app.use(function(request, response) {
    response.status = 404
    response.end('404!!!')
})

http.createServer(app).listen(port)