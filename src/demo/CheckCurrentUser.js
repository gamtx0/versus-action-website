import React, {useState} from "react"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import * as sdk from "@onflow/sdk"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const scriptOne = `
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

pub fun main(address:Address) : AddressStatus {
    // get the accounts' public address objects
    let account = getAccount(address)
    let status= AddressStatus(address)
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

export default function ScriptOne() {
  const [data, setData] = useState(null)
  const [addr, setAddr] = useState(null)

  const runScript = async (event) => {
    event.preventDefault()

    const response = await fcl.send([
      fcl.script(scriptOne),
      sdk.args([ sdk.arg(addr, t.Address) ])
    ])
    
    setData(await fcl.decode(response))
  }

  const updateAddr = (event) => {
    event.preventDefault();

    setAddr(event.target.value)
  }


  return (
    <Card>
      <Header>check status</Header>
      <input
        placeholder="Enter Flow address with 0x prefix"
        onChange={updateAddr}
      />
      <button onClick={runScript}>Run Script</button>

      {data && (
          <Code>
            {
                JSON.stringify(data, null, 2)
            }
        </Code>
      )}
    </Card>
  )
}