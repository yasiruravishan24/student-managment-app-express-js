const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const studentRoutes = require('./routes/student')
var bodyParser = require('body-parser');
require('dotenv').config()

const app = express()
const port = process.env.APP_PORT

app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/img', express.static(__dirname + '/public/img'))
app.use(expressLayouts)
app.use(bodyParser.json());                        
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/student', studentRoutes)

app.set('layout', './layouts/app')
app.set('view engine', 'ejs')


app.get('', (req, res) => {
    res.redirect('/student/create')
})

app.all('*', (req, res) => {
    res.render('404', {
        title: "Page Not Found"
    })
})

app.listen(port, () => {
    console.log(`server listing port: ${port}....`)
})