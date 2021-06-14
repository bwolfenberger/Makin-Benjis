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
    name: 'logan',
    cash: 3208,
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

// db.portfolio.findOne({
//     where: {
//         name: 'logan'
//     }
// })
// .then(portfolio => {
//     console.log('adding transaction to this portfolio:', portfolio.name)
//     portfolio.createTransaction({
//     ticker: 'ABCD',
//     price: 3.50,
//     quantity: 2,
//     }).then( newTrans => {
//         console.log(newTrans)
//     })
// })

// db.portfolio.findOne({
//     where: {
//         name: 'eri'
//     }
// }).then(portfolio => {
//     portfolio.getTransactions()
//     .then(transactions => {
//         transactions.forEach(transaction => {
//             console.log(transaction.ticker)
//         })
//     })
// })

// db.transaction.destroy({
//     where: {ticker: 'AMZN'}
// })
