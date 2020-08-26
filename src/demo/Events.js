import React, {useState, useEffect} from "react"
import * as sdk from "@onflow/sdk"
import * as fcl from "@onflow/fcl"



const GetEvents = ({startBlock, dropId, auctionId}) => {
  const [result, setResult] = useState(null)

  const eventType="A.045a1763c93006ca.Versus.Bid"

  useEffect(() => {
    async function fetchEvent() {
      const url = await fcl.config().get("accessNode.api")
      const response = await sdk.send(await sdk.build([
        sdk.getEvents(eventType, startBlock, null),
      ]), { node: url })
  
      const decodedResponse = await sdk.decodeResponse(response)
      console.log(decodedResponse)
      const filtered = decodedResponse
      .filter(result => result.data.dropId==dropId && result.data.auctionId == auctionId )
      .map(result => ({
        amount: result.data.bidPrice,
        address: result.data.bidderAddress,
        blockHeight: result.data.blockHeight, 
        date: new Date(result.data.time * 1000 ).toLocaleString(),
        unixTime: result.data.time
      }))
      setResult(filtered)
    }

    fetchEvent()
  }, [eventType, startBlock, dropId,auctionId ])

  return (
    <div>
      { result && 
      <table>
        <thead>
          <th>Address</th>
          <th>Time</th>
          <th>Bid</th>
        </thead>
        <tbody>
        { result.map( it =>
            <tr>
              <td>{it.address}</td>
              <td>{it.date}</td>
              <td>{it.amount}</td>
            </tr>
          )}
          </tbody>
      </table>
      }
    </div>
  )
}
export default GetEvents