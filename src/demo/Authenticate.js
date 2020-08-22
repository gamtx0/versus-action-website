import React, {useState, useEffect, useRef} from "react"
import styled from "styled-components"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import * as sdk from "@onflow/sdk"

import Card from '../components/Card'

const Profile = styled.div`
  margin-bottom: 10px;
`
const Img = styled.img`
  width: 50px;
  height: 50px;
`

const scriptBuyerStatus = `
import FungibleToken from 0xee82856bf20e2aa6
import NonFungibleToken from 0x01cf0e2f2f715450
import DemoToken from 0x179b6b1cb6755e31
import Art from 0xf3fcd2c1a78f5eee
import Auction from 0xe03daebed8ca0615
import Versus from 0x045a1763c93006ca

pub struct BuyerStatus {

  pub(set) var address:Address
  pub(set) var balance: UFix64
  pub(set) var art: {UInt64: {String : String}}
  init (_ address:Address) {
    self.address=address
    self.balance= UFix64(0)
    self.art= {}
  }
}

pub fun main(address:Address) : BuyerStatus? {
    // get the accounts' public address objects
    let account = getAccount(address)
    let status= BuyerStatus(address)
    if let demoTokenCapability =account.getCapability(/public/DemoTokenBalance) {
        if let demoTokens= demoTokenCapability.borrow<&{FungibleToken.Balance}>() {
          status.balance=demoTokens.balance
        }else {
          return nil
        }
    } 
    
    if let artCap = account.getCapability(/public/ArtCollection) {
       if let art= artCap.borrow<&{NonFungibleToken.CollectionPublic}>()  {
           for id in art.getIDs() {
             var metadata=art.borrowNFT(id: id).metadata
             status.art[id]=metadata
           }
       } else {
         return nil
       }
    } 

    return status
}
`

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

const SignInOutButton = ({ user: { loggedIn } }) => {
  const signInOrOut = async (event) => {
    event.preventDefault()

    if (loggedIn) {
      fcl.unauthenticate()
    } else {
      fcl.authenticate()
    }
  }

  return (
    <button onClick={signInOrOut}>
      {loggedIn ? 'Sign Out' : 'Sign In/Up'}
    </button>
  )
}

const UserProfile = ({ user }) => {
  const [userFetched, setUserFetched] = useState(false)
  const [data, setData] = useState(null)
  const [transaction, setTransaction] = useState(null)

  useEffect(() => {
    async function fetchUserDataFromChain() {
      const address="0x"+user.addr

      console.log(address)
      const response = await fcl.send([
        fcl.script(scriptBuyerStatus),
        sdk.args([ sdk.arg(address, t.Address) ])
      ])
      setData(await fcl.decode(response)) 
      setUserFetched(true)
    }
    fetchUserDataFromChain()
  }, [user, transaction])

  useEffect(() => {
    async function setupUser() {
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

    if(userFetched && data==null && user ) {
      console.log("Seting up user2")
      console.log(user)
      console.log(data)
      console.log(userFetched)
      setupUser()
    }else {
      console.log("Not Seting up user ")
      console.log("userFetched="+userFetched)
      console.log("data="+data)
    }
  }, [userFetched, data])

  return (
    <Profile>
      {user.identity.avatar && <Img src={user.identity.avatar} />}

     <div>
        <b>Name</b>: {user.identity.name || "Anonymous"}
      </div>
      <div>
        <b>Balance</b>: {data?.balance || "0"} 
      </div>
      <div>
        <b>Address</b>: {user.addr || ""}
      </div>
      <div>
        <b>Art</b>: {JSON.stringify(data?.art || "") } 
      </div>
 
    </Profile>
  )
}

const CurrentUser = () => {
  const [user, setUser] = useState({})

  useEffect(() =>
    fcl
      .currentUser()
      .subscribe(user => setUser({...user}))
  , [])

  return (
    <Card>
      {user.loggedIn && <UserProfile user={user} />}

      <SignInOutButton user={user} />
    </Card>
  )
}

export default CurrentUser

