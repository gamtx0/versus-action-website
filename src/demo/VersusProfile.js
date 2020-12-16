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
import FungibleToken from 0xee82856bf20e2aa6
import NonFungibleToken, DemoToken, Art, Auction, Versus from 0x01cf0e2f2f715450

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
`;

const setupVersusUser = `
import FungibleToken from 0xee82856bf20e2aa6
import NonFungibleToken, DemoToken, Art from 0x01cf0e2f2f715450

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
`;

const VersusProfile = ({ user, bidTransaction }) => {
  const [versusProfileFetched, setVersusProfileFetched] = useState(false);
  const [versusProfile, setVersusProfile] = useState(false);
  const [transaction, setTransaction] = useState(null);

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
  }, [user, transaction, bidTransaction]);

  useEffect(() => {
    async function setupUser() {
      const response = await fcl.send([
        fcl.transaction(setupVersusUser),
        fcl.args([fcl.arg(100.01, t.UFix64)]),
        fcl.proposer(fcl.currentUser().authorization),
        fcl.payer(fcl.currentUser().authorization),
        fcl.authorizations([fcl.currentUser().authorization]),
        fcl.limit(1000),
      ]);
      setTransaction(await fcl.tx(response).onceSealed());
    }

    if (versusProfileFetched && versusProfile == null && user.addr) {
      setupUser();
    }
  }, [user, versusProfileFetched, versusProfile]);

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
