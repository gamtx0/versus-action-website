import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as sdk from "@onflow/sdk";
import * as fcl from "@onflow/fcl";

const GetEvents = ({ startBlock, dropId, auctionId, bidTransaction }) => {
  const [result, setResult] = useState(null);

  const eventType = "A.01cf0e2f2f715450.Versus.Bid";

  useEffect(() => {
    async function fetchEvent() {
      const url = await fcl.config().get("accessNode.api");
      const response = await sdk.send(
        await sdk.build([sdk.getEvents(eventType, startBlock, null)]),
        { node: url }
      );

      const decodedResponse = await sdk.decodeResponse(response);
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
