import React, {useState} from "react"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import * as sdk from "@onflow/sdk"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const scriptOne = `
import Versus from 0x045a1763c93006ca

pub fun main(address:Address) : {UInt64: Versus.DropStatus}? {
    
    if let versusCap = account.getCapability(/public/Versus) {
        if let versus = versusCap.borrow<&{Versus.PublicDrop}>() {
          return versus.getAllStatuses()
        } 
    } 
    return nil
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