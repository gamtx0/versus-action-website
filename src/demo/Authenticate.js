import React, {useState, useEffect} from "react"
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

pub fun main(address:Address) : BuyerStatus {
    // get the accounts' public address objects
    let account = getAccount(address)
    let status= BuyerStatus(address)
    if let demoTokenCapability =account.getCapability(/public/DemoTokenBalance) {
        if let demoTokens= demoTokenCapability.borrow<&{FungibleToken.Balance}>() {
          status.balance=demoTokens.balance
        }
    }
    
    if let artCap = account.getCapability(/public/ArtCollection) {
       if let art= artCap.borrow<&{NonFungibleToken.CollectionPublic}>()  {
           for id in art.getIDs() {
             var metadata=art.borrowNFT(id: id).metadata
             status.art[id]=metadata
           }
       }
    }
    return status
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
  const [data, setData] = useState(null)


  useEffect(() => {
    async function fetchUserDataFromChain() {
    const response = await fcl.send([
      fcl.script(scriptBuyerStatus),
      sdk.args([ sdk.arg(user.addr, t.Address) ])
    ])
    console.log(response)
    setData(await fcl.decode(response)) 
    }
    fetchUserDataFromChain()
  }, [user])

  //TODO: here i want to run setupUser automatically if not done
  //TODO: Here i want to run CheckCurrentUser and add information about balance and NFT owned to Profile below
  return (
    <Profile>
      {user.identity.avatar && <Img src={user.identity.avatar} />}

      <div>
        <b>Name</b>: {user.identity.name || "Anonymous"}
      </div>
      <div>
        <b>Address</b>: {user.addr || ""}
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
