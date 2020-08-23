import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import * as sdk from "@onflow/sdk"

const bidTransaction = `
import FungibleToken from 0xee82856bf20e2aa6
import NonFungibleToken from 0x01cf0e2f2f715450
import Auction from 0xe03daebed8ca0615
import Versus from 0x045a1763c93006ca

transaction(marketplace: Address, dropId: UInt64, auctionId: UInt64, bidAmount: UFix64) {
    // reference to the buyer's NFT collection where they
    // will store the bought NFT

    let vaultCap: Capability<&{FungibleToken.Receiver}>
    let collectionCap: Capability<&{NonFungibleToken.CollectionPublic}> 
    // Vault that will hold the tokens that will be used
    // to buy the NFT
    let temporaryVault: @FungibleToken.Vault

    prepare(account: AuthAccount) {

        // get the references to the buyer's Vault and NFT Collection receiver
        self.collectionCap = account.getCapability<&{NonFungibleToken.CollectionPublic}>(/public/ArtCollection)!

        self.vaultCap = account.getCapability<&{FungibleToken.Receiver}>(/public/DemoTokenReceiver)!
                    
        let vaultRef = account.borrow<&FungibleToken.Vault>(from: /storage/DemoTokenVault)
            ?? panic("Could not borrow owner's Vault reference")

        // withdraw tokens from the buyer's Vault
        self.temporaryVault <- vaultRef.withdraw(amount: bidAmount)
    }

    execute {
        // get the read-only account storage of the seller
        let seller = getAccount(marketplace)

        // get the reference to the seller's sale
        let versusRef = seller.getCapability(/public/Versus)!
                         .borrow<&{Versus.PublicDrop}>()
                         ?? panic("Could not borrow seller's sale reference")

        versusRef.placeBid(dropId: dropId, auctionId: auctionId, bidTokens: <- self.temporaryVault, vaultCap: self.vaultCap, collectionCap: self.collectionCap)
    }
}
`

// TODO: dropId should be sent in as global prop. This should only be called if drop is active and not started yet
const Bid = () => {
  const [transaction, setTransaction] = useState(null)
  const [drop, setDrop] = useState(null)
  const [user, setUser] = useState({})
  const [uniquePrice, setUniquePrice] = useState("10.01")
  const [editionPrice, setEditionPrice] = useState("10.01")
  const [editionAuctionId, setEditionAuctionId] = useState(2) //todo read this from props sent in. The current active edition auction

  useEffect(() =>
    fcl
      .currentUser()
      .subscribe(user => setUser({...user}))
  , [])


  const updateUniquePrice = (event) => {
    event.preventDefault();

    setUniquePrice(event.target.value)
  }

  const BidOnAuction = async (dropId, auctionId, amount) => {
    
          const response = await fcl.send([
            fcl.transaction(bidTransaction),
            fcl.args( [
              fcl.arg("0x120e725050340cab", t.Address),
              fcl.arg(dropId, t.UInt64),
              fcl.arg(auctionId, t.UInt64),
              fcl.arg(parseFloat(amount), t.UFix64)
              ]),
            fcl.proposer(fcl.currentUser().authorization),
            fcl.payer(fcl.currentUser().authorization),
            fcl.authorizations([ fcl.currentUser().authorization ]),
            fcl.limit(1000),
          ])
          setTransaction(await fcl.tx(response).onceSealed())
     }

  useEffect(() => {
    async function fetchDrop() {

    const response = await fcl.send([
      fcl.script(fetchVersusDrop),
      sdk.args([ sdk.arg("0x120e725050340cab", t.Address) ])
    ])
    const dropResponse=await fcl.decode(response)
    setDrop(dropResponse)
    setUniquePrice(dropResponse.uniqueStatus.minNextBid)
    setEditionPrice(dropResponse.editionsStatuses[editionAuctionId].minNextBid)
    }
    fetchDrop()
  }, [transaction, editionAuctionId])


  //TODO: find the cheapest item with the lowest edition and set that as active in the select box
  //TODO: update the current editionNextBid when this value changes
  function generateEditionSelectBox(editionStatus) {
    return <select value={editionAuctionId} onChange={ e => setEditionAuctionId(e.target.value)} > 
        { Object.keys(editionStatus).map(key => 
            <option value={editionStatus[key].id}>{editionStatus[key].metadata.edition} - price: {editionStatus[key].price}</option>
        )
      }
    </select>

  }
  return (
    <div>
    { user.loggedIn && drop && (
        <div>
          <img alt="art" src={drop.uniqueStatus.metadata.url} width="200px"  />
          <br />
          {drop.uniqueStatus.metadata.name} <br/> 
          by: {drop.uniqueStatus.metadata.artist} <br/>
          <br />
          <a href="read">read about the piece...</a>

          <br />
          <br />
          <br />
          <br />
          Blocks remaining: {drop.uniqueStatus.blocksRemaining}
         </div>
    )  }
    { user.loggedIn && drop &&(
        <div>
          Unique auction <br/>
          Price: {drop.uniquePrice}
          <br />

          Amount: <input type="number" step="0.01" value={uniquePrice} onChange={updateUniquePrice} />
          <button onClick={() => BidOnAuction(drop.dropId,drop.uniqueStatus.id, uniquePrice)}>Bid</button>
          <br />
          <br />
          bid history: {drop.uniqueStatus.bids}
          <br />
          TODO: Listen to events for bid history

        </div>
    )}

    { user.loggedIn && drop &&(
        <div>
          Editioned auction active : { drop.editionsStatuses[editionAuctionId].metadata.edition}<br/>
          Total editioned Price: {drop.editionPrice}
          <br />

          Select edition: { generateEditionSelectBox(drop.editionsStatuses)}
          <br />
          Amount: <input type="number" step="0.01" value={editionPrice} onChange={ e => setEditionPrice(e.target.value)} />
          <button onClick={() => BidOnAuction(drop.dropId, editionAuctionId, editionPrice)}>Bid</button>
          <br />
          <br />
          bid history: {drop.editionsStatuses[editionAuctionId].bids}
          <br />
          TODO: Listen to events for bid history

        </div>
    )}
    </div>
   )
}

export default Bid2
