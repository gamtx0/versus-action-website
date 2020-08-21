import React, {useState} from "react"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const simpleTransaction = `

import FungibleToken from 0xee82856bf20e2aa6
import NonFungibleToken from 0x01cf0e2f2f715450
import Auction from 0xe03daebed8ca0615
import Versus from 0x045a1763c93006ca

transaction(marketplace: Address, dropId: UInt64, auctionId: UInt64, bidAmount: UFix64) {
    // reference to the buyer's NFT collection where they
    // will store the bought NFT

    let vaultCap: Capability<&{FungibleToken.Receiver}>
    let collectionCap: Capability<&{NonFungibleToken.CollectionPublic}> 
    // Vault that will hold the tokens that will be used
    // to buy the NFT
    let temporaryVault: @FungibleToken.Vault

    prepare(account: AuthAccount) {

        // get the references to the buyer's Vault and NFT Collection receiver
        self.collectionCap = account.getCapability<&{NonFungibleToken.CollectionPublic}>(/public/ArtCollection)!
        if !self.collectionCap.check() {
           panic("Unable to borrow a reference to the NFT collection")
        }

        self.vaultCap = account.getCapability<&{FungibleToken.Receiver}>(/public/DemoTokenReceiver)!
        if !self.vaultCap.check() {
           panic("Could not find demoVaultCap")
        }
                    
        let vaultRef = account.borrow<&FungibleToken.Vault>(from: /storage/DemoTokenVault)
            ?? panic("Could not borrow owner's Vault reference")

        // withdraw tokens from the buyer's Vault
        self.temporaryVault <- vaultRef.withdraw(amount: bidAmount)
    }

    execute {
        // get the read-only account storage of the seller
        let seller = getAccount(marketplace)

        // get the reference to the seller's sale
        let versusRef = seller.getCapability(/public/Versus)!
                         .borrow<&{Versus.PublicDrop}>()
                         ?? panic("Could not borrow seller's sale reference")

        versusRef.placeBid(dropId: dropId, auctionId: auctionId, bidTokens: <- self.temporaryVault, vaultCap: self.vaultCap, collectionCap: self.collectionCap)
    }
}
`

const Bid = () => {
  const [status, setStatus] = useState("Not started")
  const [transaction, setTransaction] = useState(null)
  const [auctionId, setAuctionId] = useState(null)
  const [dropId, setDropId] = useState(null)
  const [amount, setAmount] = useState(null)

  const SetupUser = async (event) => {
    event.preventDefault()
    
    setStatus("Resolving...")

    const blockResponse = await fcl.send([
      fcl.getLatestBlock(),
    ])

    const block = await fcl.decode(blockResponse)
    
    try {
      const { transactionId } = await fcl.send([
        fcl.transaction(simpleTransaction),
        fcl.args( [
          //TODO: config
          fcl.arg("0x120e725050340cab", t.Address),
          fcl.arg(dropId, t.UInt64),
          fcl.arg(auctionId, t.UInt64),
          fcl.arg(amount, t.UFix64) 
          ]),
        fcl.proposer(fcl.currentUser().authorization),
        fcl.payer(fcl.currentUser().authorization),
        fcl.authorizations([ fcl.currentUser().authorization ]),
        fcl.limit(1000),
        fcl.ref(block.id),
      ])

      setStatus("Transaction sent, waiting for confirmation")

      const unsub = fcl
        .tx({ transactionId })
        .subscribe(transaction => {
          setTransaction(transaction)

          if (fcl.tx.isSealed(transaction)) {
            setStatus("Transaction is Sealed")
            unsub()
          }
        })
    } catch (error) {
      console.error(error);
      setStatus("Transaction failed")
    }
  }

  const updateAuctionId = (event) => {
    event.preventDefault();

    setAuctionId(parseInt(event.target.value))
  }

  const updateDropId = (event) => {
    event.preventDefault();

    setDropId(parseInt(event.target.value))
  }

  const updateAmount = (event) => {
    event.preventDefault();

    console.log(event.target.value)
    let v=parseFloat(event.target.value)
    console.log("foo")
    console.log(v)
    setAmount(v)
  }


  return (
    <Card>
      <Header>Bid</Header>
       <input
        placeholder="DropId"
        onChange={updateDropId}
      />

      <input
        placeholder="AuctionId"
        onChange={updateAuctionId}
      />

      <input
        placeholder="Amount"
        value="10.0"
        onChange={updateAmount}
      />


      <button onClick={SetupUser}>
        Send
      </button>

      <Code>Status: {status}</Code>

      {transaction && <Code>{JSON.stringify(transaction, null, 2)}</Code>}
    </Card>
  )
}

export default Bid
