import React from "react"

import Card from '../components/Card'
import Bid from './Bid'

const UniqueAuction = ({ drop, marketplaceAccount,  handleBidTransaction }) => {

  const winning= drop.winning === "UNIQUE"
  return (
    <Card>
         { winning && <div>WINNING!</div>}
   
          Unique auction <br/>
          Price: {drop.uniquePrice}
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
          TODO: Listen to events for bid history

      </Card>
   )
}

export default UniqueAuction
