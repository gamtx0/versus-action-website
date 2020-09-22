import React, { useState, useEffect } from "react";
import styled from "styled-components";

import * as fcl from "@onflow/fcl";

import Authenticate from "./demo/Authenticate";
import VersusProfile from "./demo/VersusProfile";
import Drop from "./demo/Drop";
import UniqueAuction from "./demo/UniqueAuction";
import EditionedAuction from "./demo/EditionedAuction";

import { ThemeProvider } from "styled-components";
import { Grid, Col, Row } from "react-styled-flexboxgrid";

const theme = {
  flexboxgrid: {
    // Defaults
    gridSize: 12, // columns
    gutterWidth: 1, // rem
    outerMargin: 2, // rem
    mediaQuery: "only screen",
    container: {
      sm: 46, // rem
      md: 61, // rem
      lg: 76, // rem
    },
    breakpoints: {
      xs: 0, // em
      sm: 48, // em
      md: 64, // em
      lg: 75, // em
    },
  },
};

export const Image = styled.img`
  width: 100px;
  display: block;
  margin: auto;
`;

const marketplaceAccount = "0x120e725050340cab";

function App() {
  const [user, setUser] = useState({});
  const [drop, setDrop] = useState(null);
  const [bidTransaction, setBidTransaction] = useState(null);

  const handleDrop = (value) => {
    setDrop(value);
  };

  const handleBidTransaction = (value) => {
    setBidTransaction(value);
  };

  useEffect(
    () => fcl.currentUser().subscribe((user) => setUser({ ...user })),
    []
  );

  function sortEditionedAuctions(auctions) {
    var entries = Object.values(auctions);
    entries.sort(function (a, b) {
      if (a.price > b.price) {
        return 1;
      }
      if (b.price > a.price) {
        return -1;
      }

      if (
        a.metadata.edition.padStart(2, 0) > b.metadata.edition.padStart(2, 0)
      ) {
        return 1;
      }

      if (
        b.metadata.edition.padStart(2, 0) > a.metadata.edition.padStart(2, 0)
      ) {
        return -1;
      }

      if (a.bids > b.bids) {
        return 1;
      }

      if (b.price > a.price) {
        return -1;
      }

      return 0;
    });
    return entries;
  }
  return (
    <div class="content-wrapper">
      <ThemeProvider theme={theme}>
        <Grid fluid="true">
          <Row center="xs">
            <Col xs={4} className="flex justify-content-end align-items-center">
              <Authenticate user={user} />
            </Col>
            <Col xs={3}>
              <Image className="logo" src="logo.png" />
            </Col>
            <Col
              xs={4}
              className="flex justify-content-start align-items-center"
            >
              {user.loggedIn && (
                <VersusProfile user={user} bidTransaction={bidTransaction} />
              )}
            </Col>
          </Row>
          <Row around="xs">
            <Col xs={4}>
              {user.loggedIn && drop && (
                <UniqueAuction
                  drop={drop}
                  marketplaceAccount={marketplaceAccount}
                  handleBidTransaction={handleBidTransaction}
                  bidTransaction={bidTransaction}
                />
              )}
            </Col>
            <Col xs={4}>
              {user.loggedIn && (
                <Drop
                  marketplaceAccount={marketplaceAccount}
                  drop={drop}
                  handleDrop={handleDrop}
                  bidTransaction={bidTransaction}
                  handleBidTransaction={handleBidTransaction}
                />
              )}
            </Col>
            <Col xs={4}>
              {user.loggedIn && drop && (
                <EditionedAuction
                  drop={drop}
                  marketplaceAccount={marketplaceAccount}
                  handleBidTransaction={handleBidTransaction}
                  auctions={sortEditionedAuctions(drop.editionsStatuses)}
                  bidTransaction={bidTransaction}
                />
              )}
            </Col>
          </Row>
        </Grid>
      </ThemeProvider>
    </div>
  );
}

export default App;
