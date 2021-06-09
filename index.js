const express = require('express')

const app = express()
const PORT = 3000

app.get('/', (req, res) => {
    res.send('hi eri')
})

app.listen(PORT, () => {
    console.log(`listening to ${PORT} 🐣`)
})