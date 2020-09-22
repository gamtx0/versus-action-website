import React, { useState } from "react";
import Bid from "./Bid";
import {
  EditionedAuctionBox,
  Title,
  Price,
  Winning,
  Loosing,
  Tie,
  Pretext,
  History,
} from "../components/Auction";

import { BidFieldset, Label, Select } from "../components/Form";

import Events from "./Events";

const EditionedAuction = ({
  drop,
  marketplaceAccount,
  handleBidTransaction,
  auctions,
  bidTransaction,
}) => {
  const [auctionId, setAuctionId] = useState(parseInt(auctions[0].id));

  function generateEditionSelectBox(editionStatus) {
    return (
      <Select
        name="editions"
        value={auctionId}
        onChange={(e) => setAuctionId(parseInt(e.target.value))}
      >
        {editionStatus.map((edition) => (
          <option key={edition.id} value={edition.id}>
            edition: {edition.metadata.edition} - bids: {edition.bids} - price:{" "}
            {edition.price}
          </option>
        ))}
      </Select>
    );
  }

  const activeAuction = drop.editionsStatuses[auctionId];

  var status = <Winning>Highest bid</Winning>;
  if (drop.winning === "UNIQUE") {
    status = <Loosing>Lowest bid</Loosing>;
  } else if (drop.winning === "TIE") {
    status = <Tie>Tied bid</Tie>;
  }

  return (
    <EditionedAuctionBox>
      <Title>Own 1 of {activeAuction.metadata.maxEdition} NFTs</Title>
      <Pretext className="pad-top-30">collective total of all bids:</Pretext>
      <Price>{drop.editionPrice} FT</Price>
      <div className="flex justify-content-end margin-bottom-110">{status}</div>
      <BidFieldset>
        <Label for="editions">edition</Label>
        {generateEditionSelectBox(auctions)}
        <Bid
          marketplaceAccount={marketplaceAccount}
          dropId={drop.dropId}
          auctionId={auctionId}
          minNextBid={activeAuction.minNextBid}
          handleBidTransaction={handleBidTransaction}
        />
      </BidFieldset>
      <History>
        <Pretext>
          bid history: <span>{activeAuction.bids}</span>
        </Pretext>
        {
          <Events
            startBlock={drop.uniqueStatus.startBlock}
            dropId={drop.dropId}
            auctionId={auctionId}
            bidTransaction={bidTransaction}
          />
        }
      </History>
    </EditionedAuctionBox>
  );
};

export default EditionedAuction;
