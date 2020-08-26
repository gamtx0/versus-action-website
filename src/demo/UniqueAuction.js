import React from "react"

import Bid from './Bid'
import Events from './Events'

import {UniqueAuctionBox, Title, Price} from '../components/Auction'

const UniqueAuction = ({ drop, marketplaceAccount,  handleBidTransaction }) => {

  const winning= drop.winning === "UNIQUE"
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
          <br />
         { winning && <div>WINNING!</div>}
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
          <br />

          {  <Events 
          startBlock={drop.uniqueStatus.startBlock}
          dropId={drop.dropId}
          auctionId={drop.uniqueStatus.id}
          /> }
      </UniqueAuctionBox>
   )
}

export default UniqueAuction
