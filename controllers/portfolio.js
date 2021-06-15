let express = require('express')
let db = require('../models')
let router = express.Router()

//portfolio/delete route
router.delete('/delete', (req, res) => {
    // delete data from portfolio database
    db.portfolio.destroy({
        where: {name: req.body.currentUser}
    })
    res.redirect('/')
        .catch((err) => {
        res.status(400)
    })
})

router.get('/:user', (req, res) => {
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
        res.status(err)
    })
})

module.exports = router 