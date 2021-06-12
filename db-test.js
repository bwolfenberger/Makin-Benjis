const db = require('./models')

// db.transaction.create({
//     ticker: 'V',
//     price: 3.45,
//     quantity: 20,
//     portfolioId: 1
// }).then(newTrans => {
//     console.log(`${newTrans.quantity} shares of ${newTrans.ticker} purchased for $${newTrans.price} each.}`)
// })

db.portfolio.create({
    name: 'benji',
    cash: 555093,
}).then(newUser => {
    console.log(`${newUser.name}'s portfolio created.`)
})

// db.user.update({
//     name: 'eri'
// }, {
//     where: {
//         name: 'Eri'
//     }
// })
