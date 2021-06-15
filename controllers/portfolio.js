let express = require('express')
let db = require('../models')
let router = express.Router()

// delete specific portfolio from table
router.delete('/delete', (req, res) => {
    db.portfolio.destroy({
        where: {name: req.body.currentUser}
    })
    res.redirect('/')
})

// find and display transactions associated with specific portfolio
router.get('/:user', (req, res) => {
    db.portfolio.findOne({
        where: {name: req.params.user}
    })
    .then(portfolio => {
        portfolio.getTransactions()
        .then(transactions => {
            res.render( 'portfolio', {transactions, portfolio})
        })
    })
    .catch((err) => {
        console.log(err)
        res.status(err)
    })
})

module.exports = router 