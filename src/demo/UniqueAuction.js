import React from "react"

import Bid from './Bid'
import Events from './Events'

import {UniqueAuctionBox, Title, Price,  Winning, Loosing, Tie} from '../components/Auction'

const UniqueAuction = ({ drop, marketplaceAccount,  handleBidTransaction, bidTranscation }) => {

  var status= <Winning>Highest bid</Winning>
  if(drop.winning === "EDITIONED") {
    status = <Loosing>Lowest bid</Loosing>
  }else if(drop.winning === "TIE") {
    status = <Tie>Tied bid</Tie>
  }

  return (
    <UniqueAuctionBox>
   
          <Title>Own the 1/1 NFT</Title>
          Current bid:<br /> 
          <Price>
          {drop.uniquePrice} FT
          </Price>
          <br />
          <br />
          <br />
         { status }
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <Bid 
            marketplaceAccount={marketplaceAccount} 
            dropId={drop.dropId} 
            auctionId={drop.uniqueStatus.id} 
            minNextBid={drop.uniqueStatus.minNextBid}
            handleBidTransaction={handleBidTransaction}  />
          <br />
           bid history: {drop.uniqueStatus.bids}
          <br />
          <br />

          {  <Events 
          startBlock={drop.uniqueStatus.startBlock}
          dropId={drop.dropId}
          auctionId={drop.uniqueStatus.id}
          bidTranscation={bidTranscation}
          /> }
      </UniqueAuctionBox>
   )
}

export default UniqueAuction
