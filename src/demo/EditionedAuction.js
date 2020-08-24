import React, {useState}  from "react"
import Card from '../components/Card'
import Bid from './Bid'

const EditionedAuction = ({ drop, marketplaceAccount, handleBidTransaction, firstAuction }) => {
  const [auctionId, setAuctionId] = useState(parseInt(firstAuction)) 

  //TODO: find the cheapest item with the lowest edition and set that as active in the select box
  //TODO: update the current editionNextBid when this value changes
  function generateEditionSelectBox(editionStatus) {
    return <select value={auctionId} onChange={ e => setAuctionId(parseInt(e.target.value))} > 
        { Object.keys(editionStatus).map(key => 
            <option key={editionStatus[key].id} value={editionStatus[key].id}>{editionStatus[key].metadata.edition} - price: {editionStatus[key].price}</option>
        )
      }
    </select>

  }

  const activeAuction=drop.editionsStatuses[auctionId]

  return (
        <Card>
          Editioned auction active : { activeAuction.metadata.edition}<br/>
          Total editioned Price: {drop.editionPrice}
          <br />

          Select edition: { generateEditionSelectBox(drop.editionsStatuses)}
          <br />
         
          <Bid 
            marketplaceAccount={marketplaceAccount} 
            dropId={drop.dropId} 
            auctionId={auctionId} 
            minNextBid={activeAuction.minNextBid}
            handleBidTransaction={handleBidTransaction}  />
          <br />
          <br />
          bid history: {activeAuction.bids}
          <br />
          TODO: Listen to events for bid history

        </Card>
   )
}

export default EditionedAuction
