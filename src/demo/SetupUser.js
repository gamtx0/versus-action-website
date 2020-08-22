import React, {useState} from "react"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import * as sdk from "@onflow/sdk"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const simpleTransaction = `
import FungibleToken from 0xee82856bf20e2aa6
import DemoToken from 0x179b6b1cb6755e31
import Art from 0xf3fcd2c1a78f5eee
import NonFungibleToken from 0x01cf0e2f2f715450

transaction(tokens:UFix64) {

    prepare(acct: AuthAccount) {
      let reciverRef = acct.getCapability(/public/DemoTokenReceiver)!
        //If we have a DemoTokenReceiver then we are already set up so just return
        if reciverRef.check<&{FungibleToken.Receiver}>() {
            return
        }

        // create a new empty Vault resource
        let vaultA <- DemoToken.createVaultWithTokens(tokens)

        // store the vault in the accout storage
        acct.save<@FungibleToken.Vault>(<-vaultA, to: /storage/DemoTokenVault)

        // create a public Receiver capability to the Vault
        acct.link<&{FungibleToken.Receiver}>( /public/DemoTokenReceiver, target: /storage/DemoTokenVault)

        // create a public Balance capability to the Vault
        acct.link<&{FungibleToken.Balance}>( /public/DemoTokenBalance, target: /storage/DemoTokenVault)

        // store an empty NFT Collection in account storage
        acct.save<@NonFungibleToken.Collection>(<- Art.createEmptyCollection(), to: /storage/ArtCollection)

        // publish a capability to the Collection in storage
        acct.link<&{NonFungibleToken.CollectionPublic}>(/public/ArtCollection, target: /storage/ArtCollection)
    }
}
`

const SetupUser = () => {
  const [transaction, setTransaction] = useState(null)

  const SetupUser = async (event) => {
    event.preventDefault()
    
      const response = await fcl.send([
        fcl.transaction(simpleTransaction),
        fcl.args([fcl.arg(100.01, t.UFix64) ]),
        fcl.proposer(fcl.currentUser().authorization),
        fcl.payer(fcl.currentUser().authorization),
        fcl.authorizations([ fcl.currentUser().authorization ]),
        fcl.limit(1000),
      ])
      setTransaction(await fcl.tx(response).onceSealed())
  }

  return (
    <Card>
      <Header>setup demo token vault</Header>

      <button onClick={SetupUser}>
        Send
      </button>

      {transaction && <Code>{JSON.stringify(transaction, null, 2)}</Code>}
    </Card>
  )
}

export default SetupUser
