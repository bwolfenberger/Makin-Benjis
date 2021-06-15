const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const axios = require('axios')
const db = require('./models')
const method_override = require('method-override')
const { parse } = require('dotenv')
require('dotenv').config()

const PORT = 3000
const financeApiKey = process.env.FMP_API_KEY

const app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended:false }))
app.use(expressLayouts)
app.use(method_override('_method'))

app.get('/', (req, res) => {
    let financeUrl = `https://financialmodelingprep.com/api/v3/dowjones_constituent?apikey=${financeApiKey}`
    axios.get(financeUrl)
    .then(apiRes => {
        let financeData = apiRes.data
        res.render('index', { financeData })
    })
    .catch((err) => {
        res.status(400)
    })
})

app.get('/signin', (req, res) => {
    res.render( 'signin' )
    .catch((err) => {
        console.log(err)
        res.status(400)
    })
})

// on sign-in for submission
app.post('/signin', (req, res) => {
    db.portfolio.findOrCreate({
        where: { name: req.body.name },
        defaults: { cash: req.body.cash || 0}
    })
    res.redirect('/')
    .catch((err) => {
        res.status(400)
    })
})


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

