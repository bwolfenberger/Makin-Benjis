let express = require('express')
let axios = require('axios')
let db = require('../models')
let router = express.Router()

const financeApiKey = process.env.FMP_API_KEY

// buy route alters both tables
router.post('/buy', async (req, res) => {
    // define variables to determine total value
    let quantity = parseInt(req.body.quantity)
    let price = parseInt(req.body.price)

    await db.portfolio.decrement('cash', {
        by: (quantity * price),
        where: { name: req.body.currentUser }
    })

    // find portfolio of current user
    const myPortfolio = await db.portfolio.findOne({
        where: {name: req.body.currentUser}
    })

    // find id of current portfolio
    const myId = myPortfolio.get().id

    // create new transaction associated with current portfolio
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

// sell route alters both tables
router.post('/sell', (req, res) => {
    // get current stock price from api
    let financialUrl = `https://financialmodelingprep.com/api/v3/quote/${req.body.ticker}?apikey=${financeApiKey}`
    axios.get(financialUrl)
    .then(apiRes => {
        // define variables to determine value
        let financeData = apiRes.data
        let price = financeData[0].price
        let quantity = parseInt(req.body.quantity)

        // increase cash variable by value
        db.portfolio.increment('cash', {
            by: (quantity * price), 
            where: { name: req.body.currentUser }
        })
        // delete transaction by unique id
        db.transaction.destroy({
            where: {id: req.body.transactionId}
        })
    })
    res.redirect('/')
    .catch((err) => {
    res.status(400)
    })
})

module.exports = router