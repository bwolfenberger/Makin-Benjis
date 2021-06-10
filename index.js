const express = require('express')
const axios = require('axios')
const app = express()
const PORT = 3000
require('dotenv').config()
const financeApiKey = process.env.FMP_API_KEY

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    let financeUrl = `https://financialmodelingprep.com/api/v3/dowjones_constituent?apikey=${financeApiKey}`
    axios.get(financeUrl)
    .then(apiRes => {
        let financeData = apiRes.data
        res.render('index', { financeData})
//        res.send(financeData[0].name + financeData[0].price)
    })
})
// app.get('/:id', (req, res) => {
//     let financeUrl = `https://financialmodelingprep.com/api/v3/quote/${req.params.id}?apikey=${financeApiKey}`
//     axios.get(financeUrl)
//     .then(apiRes => {
//         let financeData = apiRes.data
//         res.render('index', { financeData})
// //        res.send(financeData[0].name + financeData[0].price)
//     })
// })

app.listen(PORT, () => {
    console.log(`listening to ${PORT} 🐣`)
})