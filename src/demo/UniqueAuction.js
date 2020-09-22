import React from "react";

import Bid from "./Bid";
import Events from "./Events";

import {
  UniqueAuctionBox,
  Title,
  Subtitle,
  Pretext,
  Price,
  Winning,
  Loosing,
  Tie,
  History,
} from "../components/Auction";

const UniqueAuction = ({
  drop,
  marketplaceAccount,
  handleBidTransaction,
  bidTranscation,
}) => {
  var status = <Winning>Highest bid</Winning>;
  if (drop.winning === "EDITIONED") {
    status = <Loosing>Lowest bid</Loosing>;
  } else if (drop.winning === "TIE") {
    status = <Tie>Tied bid</Tie>;
  }

  return (
    <UniqueAuctionBox>
      <Title>Own the 1/1 NFT</Title>
      <Subtitle>
        <span>*Plus</span> the original painting
      </Subtitle>
      <Pretext>current bid:</Pretext>
      <Price>{drop.uniquePrice} FT</Price>
      <div className="margin-bottom-170">{status}</div>

      <Bid
        marketplaceAccount={marketplaceAccount}
        dropId={drop.dropId}
        auctionId={drop.uniqueStatus.id}
        minNextBid={drop.uniqueStatus.minNextBid}
        handleBidTransaction={handleBidTransaction}
        className="margin-top-170"
      />
      <History>
        <Pretext>
          bid history: <span>{drop.uniqueStatus.bids}</span>
        </Pretext>
        {
          <Events
            startBlock={drop.uniqueStatus.startBlock}
            dropId={drop.dropId}
            auctionId={drop.uniqueStatus.id}
            bidTranscation={bidTranscation}
          />
        }
      </History>
    </UniqueAuctionBox>
  );
};

export default UniqueAuction;
