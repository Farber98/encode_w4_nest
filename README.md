# Backend for smart contracts

Querying a deployed contract through Nest.js

## Read-only data

- GET methods:
  - Query contract address
  - Query total supply
  - Query allowance from a given address to another address
  - Query transaction status by transaction hash
  - Query transaction receipt of a transaction by transaction hash

## Sending tokens

- GET methods:
  - View list of payment orders
  - View payment order by id
- POST methods:
  - Create a payment order using secret
  - Request a payment order by passing id and secret
    - Contract is called using an address with the role of minter to pay out the tokens

# Interact

Run server
```
yarn start
```

Go to localhost:3000/api to see OpenAPI spec and interact through swagger.
