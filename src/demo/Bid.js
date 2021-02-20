import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

import { BidFieldset, BidButton, PriceFieldWrapper } from "../components/Form";

const bidTransaction = `
import FungibleToken from 0x9a0766d93b6608b7
import NonFungibleToken from 0x631e88ae7f1d7c20
import from Art, Auction, Versus from 0x1ff7e32d71183db0

/*
    Transaction to make a bid in a marketplace for the given dropId and auctionId

 */
transaction(marketplace: Address, dropId: UInt64, auctionId: UInt64, bidAmount: UFix64) {
    // reference to the buyer's NFT collection where they
    // will store the bought NFT

    let vaultCap: Capability<&{FungibleToken.Receiver}>
    let collectionCap: Capability<&{Art.CollectionPublic}> 
    // Vault that will hold the tokens that will be used
    // to buy the NFT
    let temporaryVault: @FungibleToken.Vault

    prepare(account: AuthAccount) {

        // get the references to the buyer's Vault and NFT Collection receiver
        var collectionCap = account.getCapability<&{Art.CollectionPublic}>(/public/ArtCollection)

        // if collection is not created yet we make it.
        if !collectionCap.check() {
            // store an empty NFT Collection in account storage
            account.save<@NonFungibleToken.Collection>(<- Art.createEmptyCollection(), to: /storage/ArtCollection)

            // publish a capability to the Collection in storage
            account.link<&{Art.CollectionPublic}>(/public/ArtCollection, target: /storage/ArtCollection)
        }

        self.collectionCap=collectionCap
        
        self.vaultCap = account.getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
                   
        let vaultRef = account.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow owner's Vault reference")

        // withdraw tokens from the buyer's Vault
        self.temporaryVault <- vaultRef.withdraw(amount: bidAmount)
    }

    execute {
        // get the read-only account storage of the seller
        let seller = getAccount(marketplace)

        // get the reference to the seller's sale
        let versusRef = seller.getCapability(/public/Versus)
                         .borrow<&{Versus.PublicDrop}>()
                         ?? panic("Could not borrow seller's sale reference")

        versusRef.placeBid(dropId: dropId, auctionId: auctionId, bidTokens: <- self.temporaryVault, vaultCap: self.vaultCap, collectionCap: self.collectionCap)
    }
}
 
 
`;

const Bid = ({
  marketplaceAccount,
  dropId,
  auctionId,
  minNextBid,
  handleBidTransaction,
}) => {
  const [price, setPrice] = useState(minNextBid);

  useEffect(() => setPrice(parseFloat(minNextBid)), [minNextBid, auctionId]);

  const BidOnAuction = async () => {
    const response = await fcl.send([
      fcl.transaction(bidTransaction),
      fcl.args([
        fcl.arg(marketplaceAccount, t.Address),
        fcl.arg(dropId, t.UInt64),
        fcl.arg(auctionId, t.UInt64),
        fcl.arg(parseFloat(price), t.UFix64),
      ]),
      fcl.proposer(fcl.currentUser().authorization),
      fcl.payer(fcl.currentUser().authorization),
      fcl.authorizations([fcl.currentUser().authorization]),
      fcl.limit(1000),
    ]);
    handleBidTransaction(await fcl.tx(response).onceSealed());
  };

  function handleSubmit(event) {
    event.preventDefault();
    BidOnAuction();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        BidOnAuction();
      }}
    >
      <BidFieldset>
        <PriceFieldWrapper>
          <label for="price">&#120125;</label>
          <input
            name="price"
            type="number"
            min={minNextBid}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </PriceFieldWrapper>
        <BidButton type="submit" value="Place Bid" />
      </BidFieldset>
    </form>
  );
};

export default Bid;
