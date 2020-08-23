import React, {useEffect} from "react"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import * as sdk from "@onflow/sdk"

import Card from '../components/Card'

const fetchVersusDrop = `
import Versus from 0x045a1763c93006ca

pub fun main(address:Address) : Versus.DropStatus?{
    // get the accounts' public address objects
    let account = getAccount(address)
   
    if let versusCap = account.getCapability(/public/Versus) {
        if let versus = versusCap.borrow<&{Versus.PublicDrop}>() {
          let versusStatuses=versus.getAllStatuses()
          for s in versusStatuses.keys {
             let status = versusStatuses[s]!
             if status.uniqueStatus.active != false {
               log(status)
               return status
             }
          }
        } 
    } 
  return nil
}
`

const Drop = ({ marketplaceAccount, drop, handleDrop, bidTransaction, handleBidTransaction}) => {
 
  useEffect(() => {
    const interval = setInterval(() => {
      handleBidTransaction("refresh")
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  //This is rerun alot, why is that?
  useEffect(() => {
    async function fetchDrop() {
      const response = await fcl.send([
        fcl.script(fetchVersusDrop),
        sdk.args([ sdk.arg(marketplaceAccount, t.Address) ])
      ])
      const dropResponse=await fcl.decode(response)
      handleDrop(dropResponse)
      handleBidTransaction(null) //we mark that the current bid has been taken into account
    }
    if( drop == null || bidTransaction != null) {
        console.log("CHECKED BID")
        fetchDrop()
    }
  }, [drop, marketplaceAccount, bidTransaction])

  return (
     drop && <Card>  
          <img alt="art" src={drop.uniqueStatus.metadata.url} width="200px"  />
          <br />
          {drop.uniqueStatus.metadata.name} <br/> 
          by: {drop.uniqueStatus.metadata.artist} <br/>
          <br />
          <a href="read">read about the piece...</a>

          <br />
          <br />
          <br />
          <br />
          Blocks remaining: {drop.uniqueStatus.blocksRemaining}
          <br />
          Unique Price: {drop.uniquePrice} <br />
          Total editioned Price: {drop.editionPrice}

    </Card>
  )
}
//this needs to own UniqueAuction and EditionedAuction and bid state must go up here. TO refetch the drop

export default Drop
