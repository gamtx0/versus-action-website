import React, {useState}  from "react"
import Bid from './Bid'
import {EditionedAuctionBox, Title, Price} from '../components/Auction'

import {BidFieldset, Label, Select} from "../components/Form" 

import Events from './Events'

const EditionedAuction = ({ drop, marketplaceAccount, handleBidTransaction, auctions }) => {
  const [auctionId, setAuctionId] = useState(parseInt(auctions[0].id)) 



  function generateEditionSelectBox(editionStatus) {
    return <Select name="editions" value={auctionId} onChange={ e => setAuctionId(parseInt(e.target.value))} > 
        { editionStatus.map( edition =>
            <option key={edition.id} value={edition.id}>
              edition: {edition.metadata.edition} - bids: {edition.bids} - price: {edition.price}
              </option>
        )
      }
    </Select>

  }

  const activeAuction=drop.editionsStatuses[auctionId]
  const winning= drop.winning === "EDITIONED"
  return (
        <EditionedAuctionBox>

          <Title>Own 1 of {activeAuction.metadata.maxEdition} NFTs</Title>
          colective total of bids:<br />
          <Price> 
            {drop.editionPrice} Flow
          </Price>
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
          <BidFieldset>
            <Label for="editions">edition</Label>
            { generateEditionSelectBox(auctions)}


          </BidFieldset>
          <br />
         
          <Bid 
            marketplaceAccount={marketplaceAccount} 
            dropId={drop.dropId} 
            auctionId={auctionId} 
            minNextBid={activeAuction.minNextBid}
            handleBidTransaction={handleBidTransaction}  />
          <br />
          bid history: {activeAuction.bids}
          <br />
          <br />
          {  <Events 
          startBlock={drop.uniqueStatus.startBlock}
          dropId={drop.dropId}
          auctionId={auctionId}
          /> }
        </EditionedAuctionBox>
   )
}

export default EditionedAuction
