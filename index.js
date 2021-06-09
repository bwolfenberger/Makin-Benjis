const express = require('express')
const axios = require('axios')
const app = express()
const PORT = 3000
require('dotenv').config()
const financeApiKey = process.env.FMP_API_KEY

app.get('/', (req, res) => {
    let financeUrl = 'https://financialmodelingprep.com/api/v3/quote/BTCUSD?apikey=' + financeApiKey
    axios.get(financeUrl)
    .then(apiRes => {
        let financeData = apiRes.data
        res.send(financeData[0].name + financeData[0].price)
    })
})

app.listen(PORT, () => {
    console.log(`listening to ${PORT} 🐣`)
})