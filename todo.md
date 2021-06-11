- Setup
- Pull data from api
- Display stock prices in view
- Implement routes

    HOME   
    - index GET / -- show all stocks
    - show GET /:ticker -- show detail about one stock (w/ buy button)

    PORTFOLIO
    - show GET /portfolio/:user -- show info about one user (w/ sell button)(based on transactions)
    - new get /portfolio/new -- show new user form
    - create POST /portfolio -- create new user
    - update PUT /portfolio/:user -- update user portfolio (based on transactions)

    TRANSACTIONS
    - index GET / -- show all current transactions (w/ button to delete)
    - create POST /transaction -- create new transaction (buy stock)
    - destroy DELETE /transaction/:id -- delete transaction (sell stock)

- Implement controllers
- Test functionality with hardcoded data
- Implement databases