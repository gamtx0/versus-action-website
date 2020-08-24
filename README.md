# Versus flow Website
This project is based on the fcl-demo from portto.


## Getting Started

### Setting up environment 
In order for this demo to work, you have to setup the dependencies first:

- **Install Flow CLI** [Here](https://github.com/onflow/flow/blob/master/docs/cli.md)  
The Flow CLI is a command-line interface that provides useful utilities for building Flow applications. The tool we need in this demo is *Flow emulator*, a local emulator of Flow blockchain.
- **Install project dependencies**  
Run `yarn` at project root.

### Starting the services
- Checkout the https://github.com/versus-flow/auction-flow-contract 
- Start the emulator in a terminal 
- run `go run run.go` in another terminal
- **Start FCL dev-wallet**  
Run `yarn run dev-wallet` at project root, which starts FCL dev wallet with private key identical to the one defined in `./flow.json`.  
The dev wallet is served at `http://localhost:8701`
- **Start demo webapp**  
Run `yarn start` at project root and you will see the demo webapp running at `http://localhost:3000`

## Acknowledgement
- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- A lot of the examples were taken from the tutorial in [FCL](https://github.com/onflow/flow-js-sdk/tree/master/packages/fcl)

