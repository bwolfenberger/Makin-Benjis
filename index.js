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
        res.status(400)
    })
})

// on sign-in for submission
app.post('/signin', (req, res) => {
    db.portfolio.findOrCreate({
        where: { name: req.body.name },
        defaults: { cash: req.body.cash }
    })
    res.redirect('/')
    .catch((err) => {
        res.status(400)
    })
})

app.get('/portfolio/:user', (req, res) => {
    db.portfolio.findOne({
        where: {name: req.params.user}
    })

    .then(portfolio => {
        portfolio.getTransactions()
        .then(transactions => {
            console.log(transactions)
            res.render( 'portfolio', {transactions, portfolio})
            // need to find out if there's a way to pass thru portfolio
        })
    })
    .catch((err) => {
        res.status(400)
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

// await says to not do anything until this is done
app.post('/transaction/buy', async (req, res) => {
    await db.portfolio.decrement('cash', {
        by: req.body.price,
        where: {
            name: req.body.currentUser
        }
    })

    // find portfolio of current user
    const myPortfolio = await db.portfolio.findOne({
        where: {name: req.body.currentUser}
    })

    // find id of current user's portfolio
    const myId = myPortfolio.get().id

    await db.transaction.create({
        portfolioId: myId,
        ticker: req.body.ticker,
        price: req.body.price,
        quantity: req.body.quantity,
    })
    res.redirect('/')
    .catch((err) => {
        res.status(400)
    })
})

// sell stock
app.post('/transaction/sell', (req, res) => {
    // get current stock price from api
    let financialUrl = `https://financialmodelingprep.com/api/v3/quote/${req.body.ticker}?apikey=${financeApiKey}`
    axios.get(financialUrl)
    .then(apiRes => {
        let financeData = apiRes.data[0].price
        // increase cash variable by current stock price
        db.portfolio.increment('cash', {
            by: financeData, 
            where: {
                name: req.body.user
            }
        })
        // delete data from transaction database
        db.transaction.destroy({
            where: {id: req.body.transactionId}
        })
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

app.listen(PORT, () => {
    console.log(`listening to ${PORT} 🐣`)
})

{/* <form action="GET" method= "/:ticker">
    <input type="text" name="ticker">
    <input type="submit">
</form> */}