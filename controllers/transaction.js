let express = require('express')
let axios = require('axios')
let db = require('../models')
let router = express.Router()

const financeApiKey = process.env.FMP_API_KEY

// await says to not do anything until this is done
router.post('/buy', async (req, res) => {
    let quantity = parseInt(req.body.quantity)
    let price = parseInt(req.body.price)

    console.log(quantity * price)

    await db.portfolio.decrement('cash', {
        by: (quantity * price),
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
router.post('/sell', (req, res) => {
    // get current stock price from api
    let financialUrl = `https://financialmodelingprep.com/api/v3/quote/${req.body.ticker}?apikey=${financeApiKey}`
    axios.get(financialUrl)
    .then(apiRes => {
        let financeData = apiRes.data
        let price = financeData[0].price
        let quantity = parseInt(req.body.quantity)

        console.log(quantity * price)

        // increase cash variable by current stock price multiplied by quantity owned
        db.portfolio.increment('cash', {
            by: (quantity * price), 
            where: {
                name: req.body.currentUser
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


module.exports = router