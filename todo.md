- Setup
- Pull data from api
- Display stock prices in view
- Implement routes

    HOME   
    - index GET / -- show all stocks
    - show GET /:ticker -- show detail about one stock (w/ buy button)

    PORTFOLIO
    - new get /portfolio/new -- show new portfolio form
    - create POST /portfolio -- create new portfolio
    - show GET /portfolio/:user -- show info about one user (w/ sell button)(w/ associated transactions)
    - update PUT /portfolio/:user -- update user portfolio (based on transactions)

    TRANSACTIONS
    - index GET / -- show all current transactions (w/ button to delete)
    - create POST /transaction -- create new transaction (buy stock)
    - destroy DELETE /transaction/:id -- delete transaction (sell stock)

- Implement controllers
- Test functionality with hardcoded data
- Implement databases

style
add instructions and stock update frequency info
comment
method override
add routes and views
try to display current price vs purchase price
