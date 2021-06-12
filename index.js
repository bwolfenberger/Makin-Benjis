const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const axios = require('axios')
const db = require('./models')
require('dotenv').config()

const PORT = 3000
const financeApiKey = process.env.FMP_API_KEY

const app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended:false }))
app.use(expressLayouts)

app.get('/', (req, res) => {
    let financeUrl = `https://financialmodelingprep.com/api/v3/dowjones_constituent?apikey=${financeApiKey}`
    axios.get(financeUrl)
    .then(apiRes => {
        let financeData = apiRes.data
        res.render('index', { financeData })
    })
})

app.get('/portfolio/new', (req, res) => {
    res.render( 'portfolio/new')
})

app.get('/portfolio/:user', (req, res) => {
    db.portfolio.findOne({
        where: {name: req.params.user}
    })
    // .then(user => {
    //     res.render( 'portfolio', { user })
    // })
    .then(portfolio => {
        portfolio.getTransactions()
        .then(transactions => {
            res.render( 'portfolio', {transactions})
            // need to find out if there's a way to pass thru portfolio
        })
    })
})

// app.get('/portfolio/:user/', (req, res) => {
//     db.portfolio.findOne({
//         where: {name: req.params.user}
//     })
//     // .then(user => {
//     //     res.render( 'portfolio', { user })
//     // })
// })

app.post('/transaction/buy', (req, res) => {
    db.transaction.create({
    ticker: req.body.ticker,
    price: req.body.price,
    quantity: req.body.quantity,
    portfolioId: 1
}).then(newTrans => {
    console.log(`${newTrans.quantity} shares of ${newTrans.ticker} purchased for $${newTrans.price} each for a total of $${newTrans.price * newTrans.quantity}.}`)
})
    res.redirect('/' + req.body.ticker)

})

app.get('/:ticker', (req, res) => {
    let financeUrl = `https://financialmodelingprep.com/api/v3/quote/${req.params.ticker}?apikey=${financeApiKey}`
    axios.get(financeUrl)
    .then(apiRes => {
        let financeData = apiRes.data[0]
        res.render('detail', { financeData })
    })
})

app.listen(PORT, () => {
    console.log(`listening to ${PORT} 🐣`)
})

{/* <form action="GET" method= "/:ticker">
    <input type="text" name="ticker">
    <input type="submit">
</form> */}