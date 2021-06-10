const express = require('express')
const axios = require('axios')
const app = express()
const PORT = 3000
require('dotenv').config()
const financeApiKey = process.env.FMP_API_KEY
const db = require('./models')

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    let financeUrl = `https://financialmodelingprep.com/api/v3/dowjones_constituent?apikey=${financeApiKey}`
    axios.get(financeUrl)
    .then(apiRes => {
        let financeData = apiRes.data
        res.render('index', { financeData })
    })
})

app.get('/portfolio/:user', (req, res) => {
    db.user.findOne({
        where: {name: req.params.user}
    })
    .then(user => {
        console.log(req.params.user)
        res.render( 'portfolio', { user })
    })
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