import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import * as sdk from "@onflow/sdk";

const Profile = styled.div`
  font-size: 0.8em;
  color: #979797;

  span {
    display: block;

    + span {
      padding-top: 0.5rem;
    }
  }
`;

const scriptBuyerStatus = `
// This script checks that the accounts are set up correctly for the marketplace tutorial.
//

import FungibleToken from 0xee82856bf20e2aa6
import NonFungibleToken, Art, Auction, Versus from 0x01cf0e2f2f715450

pub struct AddressStatus {

  pub(set) var address:Address
  pub(set) var balance: UFix64
  pub(set) var art: {UInt64: Art.Metadata}
  init (_ address:Address) {
    self.address=address
    self.balance= 0.0
    self.art= {}
  }
}

/*
  This script will check an address and print out its FT, NFT and Versus resources
 */
pub fun main(address:Address):AddressStatus {
    // get the accounts' public address objects
    let account = getAccount(address)
    let status= AddressStatus(address)
    
    if let vault= account.getCapability(/public/flowTokenBalance).borrow<&{FungibleToken.Balance}>() {
       status.balance=vault.balance
    }

    if let art= account.getCapability(/public/ArtCollection).borrow<&{Art.CollectionPublic}>()  {
       
        for id in art.getIDs() {
          var art=art.borrowArt(id: id) 
          status.art[id]=art!.metadata
        }
    }
    return status

}
`;

const setupVersusUser = `
import FungibleToken from 0xee82856bf20e2aa6
import NonFungibleToken, DemoToken, Art from 0x01cf0e2f2f715450

transaction() {

    prepare(acct: AuthAccount) {

      // store an empty NFT Collection in account storage
      account.save<@NonFungibleToken.Collection>(<- Art.createEmptyCollection(), to: /storage/ArtCollection)

      // publish a capability to the Collection in storage
      account.link<&{Art.CollectionPublic}>(/public/ArtCollection, target: /storage/ArtCollection)
      
    }

}
`;

const VersusProfile = ({ user, bidTransaction }) => {
  const [versusProfileFetched, setVersusProfileFetched] = useState(false);
  const [versusProfile, setVersusProfile] = useState(false);

  useEffect(() => {
    async function fetchUserDataFromChain() {
      const response = await fcl.send([
        fcl.script(scriptBuyerStatus),
        sdk.args([sdk.arg(user.addr, t.Address)]),
      ]);
      setVersusProfile(await fcl.decode(response));
      setVersusProfileFetched(true);
    }
    fetchUserDataFromChain();
  }, [user, bidTransaction]);

  return (
    <Profile>
      <span>
        <b> Address</b>: {user.addr || ""}
      </span>
      <span>
        <b> Balance</b>: {versusProfile?.balance || "0"}
      </span>
    </Profile>
  );
};

export default VersusProfile;
