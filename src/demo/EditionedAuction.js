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

import {
  BidFieldset,
  SelectFieldWrapper,
  Select,
  EditionInfo,
} from "../components/Form";

import Events from "./Events";

const EditionedAuction = ({
  drop,
  marketplaceAccount,
  handleBidTransaction,
  auctions,
  bidTransaction,
}) => {
  const [auctionId, setAuctionId] = useState(parseInt(auctions[0].id));

  function generateEditionSelectBox(editionStatus, activeAuction) {
    return (
      <div className="max-width-211">
        <SelectFieldWrapper>
          <label for="editions" className="text-label">
            Select the edition # to bid on
          </label>
          <Select
            name="editions"
            value={auctionId}
            onChange={(e) => setAuctionId(parseInt(e.target.value))}
          >
            {editionStatus.map((edition) => (
              <option key={edition.id} value={edition.id}>
                #{edition.metadata.edition}
              </option>
            ))}
          </Select>
        </SelectFieldWrapper>
        <EditionInfo>
          <span className="label">
            Current bid on #{activeAuction.metadata.edition} is:
          </span>
          <span className="data">
            <span className="data__price-wrap">
              <span className="data__price-wrap__currency-label">
                &#120125;
              </span>
              <span className="data__price-wrap__price">
                {activeAuction.price}
              </span>
            </span>
            <span className="data__price-wrap__bids">
              {activeAuction.bids} bids
            </span>
          </span>
        </EditionInfo>
      </div>
    );
  }

  const activeAuction= auctions.find((a) => a.id== auctionId )

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
      <Price>&#120125; {drop.editionPrice}</Price>
      <div className="flex justify-content-end margin-bottom-110">{status}</div>
      <BidFieldset className="align-right">
        {generateEditionSelectBox(auctions, activeAuction)}
        <Bid
          marketplaceAccount={marketplaceAccount}
          dropId={drop.dropId}
          auctionId={auctionId}
          minNextBid={activeAuction.minNextBid}
          handleBidTransaction={handleBidTransaction}
        />
      </BidFieldset>
      
  
    </EditionedAuctionBox>
  );
};

export default EditionedAuction;

/*
    { drop.firstBidBlock && <History>
        <Pretext>
          bid history: <span>{activeAuction.bids}</span>
        </Pretext>
        {
          <Events
            startBlock={drop.firstBidBlock}
            dropId={drop.dropId}
            auctionId={auctionId}
            bidTransaction={bidTransaction}
          />
        }
      </History>
      }*/