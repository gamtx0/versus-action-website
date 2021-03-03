import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as sdk from "@onflow/sdk";
import * as fcl from "@onflow/fcl";
import { getEvents } from "@onflow/sdk-build-get-events";
import { getLatestBlock } from "@onflow/sdk-build-get-latest-block";
import { send } from "@onflow/sdk-send";



const GetEvents = ({ startBlock, dropId, auctionId, bidTransaction }) => {
  const [result, setResult] = useState(null);

  //TODO: change to TBid
  const eventType = "A.1ff7e32d71183db0.Versus.Bid";

  useEffect(() => {
    async function fetchEvent() {

      const latestBlock= await(send([
          getLatestBlock(true)
      ]))
      if(!startBlock || !latestBlock) {
        return
      }


      const blockHeight =latestBlock.block.height


      let decodedResponse
      try {
        const getEventsResult = await send([
          getEvents(eventType, startBlock, blockHeight),
        ]);
        decodedResponse = await fcl.decode(getEventsResult);
      }catch(e) {
        console.error("cannot get events", e)
      }

      const filtered = decodedResponse
        .filter(
          (result) =>
            result.data.dropId === dropId && result.data.auctionId === auctionId
        )
        .map((result) => ({
          amount: result.data.bidPrice,
          address: result.data.bidderAddress,
          blockHeight: result.data.blockHeight,
          date: new Date(result.data.time * 1000).toLocaleString(),
          unixTime: result.data.time,
        }))
        .reverse();

        console.log(filtered)
      setResult(filtered);
    }
    fetchEvent();
  }, [eventType, startBlock, dropId, auctionId, bidTransaction]);

  const shortenAddress = (address) => {
    let addressPrefix = address.substr(0, 5);
    let addressSuffix = address.substr(address.length - 3, address.length);

    return addressPrefix + "..." + addressSuffix;
  };

  const BidHistory = styled.table`
    padding: 0;
    width: 100%;

    th {
      border-bottom: none;
      font-weight: 400;
    }

    th,
    td {
      font-size: 14px;
      line-height: 16px;
      overflow: hidden;
      text-align: left;
      width: 25%;

      &:nth-of-type(2) {
        width: 50%;
        padding: 0 10px;
      }
    }
  `;

  const resultNotEmpty = result && result.length > 0;
  return (
    <div>
      {resultNotEmpty && (
        <BidHistory>
          <thead>
            <tr>
              <th>Address</th>
              <th>Time</th>
              <th>Bid</th>
            </tr>
          </thead>
          <tbody>
            {result.map((it) => (
              <tr key={it.date}>
                <td>{shortenAddress(it.address)}</td>
                <td>{it.date}</td>
                <td>{it.amount}</td>
              </tr>
            ))}
          </tbody>
        </BidHistory>
      )}
    </div>
  );
};
export default GetEvents;
