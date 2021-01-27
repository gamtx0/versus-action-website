import React, { useEffect } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import * as sdk from "@onflow/sdk";

import {
  Art,
  Image,
  Title,
  Artist,
  Description,
  Remaining,
  Time,
} from "../components/ArtDrop";

const fetchVersusDrop = `
import Versus from 0x01cf0e2f2f715450

pub fun main(address:Address) : Versus.DropStatus?{
    // get the accounts' public address objects
    let account = getAccount(address)
   
    let versusCap = account.getCapability(/public/Versus) 
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
  return nil
}
`;

const Drop = ({
  marketplaceAccount,
  drop,
  handleDrop,
  bidTransaction,
  handleBidTransaction,
}) => {
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      handleBidTransaction("refresh")
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  */

  //This is rerun alot, why is that?
  useEffect(() => {
    async function fetchDrop() {
      const response = await fcl.send([
        fcl.script(fetchVersusDrop),
        sdk.args([sdk.arg(marketplaceAccount, t.Address)]),
      ]);
      const dropResponse = await fcl.decode(response);
      console.log(dropResponse)
      handleDrop(dropResponse);
      handleBidTransaction(null); //we mark that the current transaction has been taken into account
    }
    if (drop == null || bidTransaction != null) {
      console.log("FETCH DROP" + marketplaceAccount);
      fetchDrop();
    }
  }, [drop, marketplaceAccount, bidTransaction]);

  return (
    drop && (
      <Art>
        <Image alt="art" src={drop.uniqueStatus.metadata.url} />
        <Title>{drop.uniqueStatus.metadata.name}</Title>
        <Artist>by: {drop.uniqueStatus.metadata.artist}</Artist>
        <Description href="read">Read about the piece...</Description>

        <Remaining>Blocks remaining:</Remaining>
        <Time>{drop.uniqueStatus.timeRemaining} seconds remain</Time>
        <Time>Ends: {new Date(drop.uniqueStatus.endTime * 1000).toLocaleString()}</Time>
        <Time>Time: {new Date().toLocaleString()}</Time>

      </Art>
    )
  );
};
//this needs to own UniqueAuction and EditionedAuction and bid state must go up here. TO refetch the drop

export default Drop;
