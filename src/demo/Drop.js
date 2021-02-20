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
// This script checks that the accounts are set up correctly for the marketplace tutorial.
//

import Auction, Versus from 0x1ff7e32d71183db0

/*
  Script used to get the first active drop in a versus 
 */
pub fun main(address:Address) : Versus.DropStatus?{
  return Versus.getActiveDrop(address: address)
}

`;

const Drop = ({
  marketplaceAccount,
  drop,
  handleDrop,
  bidTransaction,
  handleBidTransaction,
}) => {
  useEffect(() => {
    async function fetchDrop() {
      const response = await fcl.send([
        fcl.script(fetchVersusDrop),
        sdk.args([sdk.arg(marketplaceAccount, t.Address)]),
      ]);
      const dropResponse = await fcl.decode(response);
 //     console.log(dropResponse)
      handleDrop(dropResponse);
      handleBidTransaction(null); //we mark that the current transaction has been taken into account
    }
    if (drop == null || bidTransaction != null) {
      fetchDrop();
    }
  }, [drop, marketplaceAccount, bidTransaction]);

  return (
    drop && (
      <Art>
        <Image alt="art" src={drop.art} />
        <Title>{drop.uniqueStatus.metadata.name}</Title>
        <Artist>by: {drop.uniqueStatus.metadata.artist}</Artist>
        <Description href="read">Read about the piece...</Description>

        <Time>Ends: {new Date(drop.uniqueStatus.endTime * 1000).toLocaleString()}</Time>

      </Art>
    )
  );
};
//this needs to own UniqueAuction and EditionedAuction and bid state must go up here. TO refetch the drop

export default Drop;
