const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const axios = require('axios')
const db = require('./models')
const method_override = require('method-override')
require('dotenv').config()

const PORT = 3000
const financeApiKey = process.env.FMP_API_KEY

const app = express()
app.set('view engine', 'ejs')
// app.use(express.static(__dirname + '/public/'))
app.use(express.urlencoded({ extended:false }))
app.use(expressLayouts)
app.use(method_override('_method'))

// home route to display initial stocks
app.get('/', (req, res) => {
    let financeUrl = `https://financialmodelingprep.com/api/v3/dowjones_constituent?apikey=${financeApiKey}`
    axios.get(financeUrl)
    .then(apiRes => {
        let financeData = apiRes.data
        res.render('index', { financeData })
    })
    .catch((err) => {
        console.log(err)
        res.status(400)
    })
})

// route to new portfolio form
app.get('/signin', (req, res) => {
    res.render( 'signin' )
})

// find current or create new portfolio on form submission
app.post('/signin', (req, res) => {
    let lcName = req.body.name.toLowerCase()
    console.log(lcName)
    db.portfolio.findOrCreate({
        where: { name: lcName },
        // || 0 added if no value is added to cash for new portfolio
        defaults: { cash: req.body.cash || 0}
    })
    res.redirect('/')
})

// search route to find any stock or crypto
app.get('/search', (req, res) => {
    // convert search to uppercase
    let ucSearch = req.query.search.toUpperCase()
    res.redirect('/' + ucSearch)
})

// get more details from api about specific stock
app.get('/:ticker', (req, res) => {
    let financeUrl = `https://financialmodelingprep.com/api/v3/quote/${req.params.ticker}?apikey=${financeApiKey}`
    axios.get(financeUrl)
    .then(apiRes => {
        let financeData = apiRes.data[0]
        res.render('detail', { financeData })
    })
    .catch((err) => {
        res.status(400)
    })
})

// Import portfolio and transaction controllers
app.use('/portfolio', require('./controllers/portfolio'))
app.use('/transaction', require('./controllers/transaction'))

app.listen(PORT, () => {
    console.log(`listening to ${PORT} 🐣`)
})