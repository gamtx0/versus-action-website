import React, {useState, useEffect} from "react"
import styled from 'styled-components'

import * as fcl from "@onflow/fcl"

import Authenticate from './demo/Authenticate'
import VersusProfile from './demo/VersusProfile'
import Drop from './demo/Drop'
import UniqueAuction from './demo/UniqueAuction'
import EditionedAuction from './demo/EditionedAuction'
import Events from './demo/Events'

import {ThemeProvider} from 'styled-components'
import {Grid, Col, Row} from 'react-styled-flexboxgrid'

const theme = {
  flexboxgrid: {
    // Defaults
    gridSize: 12, // columns
    gutterWidth: 1, // rem
    outerMargin: 2, // rem
    mediaQuery: 'only screen',
    container: {
      sm: 46, // rem
      md: 61, // rem
      lg: 76  // rem
    },
    breakpoints: {
      xs: 0,  // em
      sm: 48, // em
      md: 64, // em
      lg: 75  // em
    }
  }
}

const Wrapper = styled.div`
  font-size: 13px;
  font-family: Arial, Helvetica, sans-serif;
`;

const marketplaceAccount="0x120e725050340cab"

function App() {
  const [user, setUser] = useState({})
  const [drop, setDrop] = useState(null)
  const [bidTransaction, setBidTransaction] = useState(null)

  const handleDrop = value => {
    setDrop(value);
  };

  const handleBidTransaction= value => {
    setBidTransaction(value)
  }

  useEffect(() => fcl
      .currentUser()
      .subscribe(user => setUser({...user}))
  , [])
  
  return (
    <div class="content-wrapper">
        <ThemeProvider theme={theme}>

    <Grid fluid="true">
    <Row>
      <Col> 
        <Authenticate user={user} />
      </Col>
        <Col size={2}>VERSUS</Col>
      <Col>
        {user.loggedIn && <VersusProfile user={user} bidTransaction={bidTransaction}/>}
      </Col>
    </Row>
    <Row around="xs">
      <Col xs={3}>
        {user.loggedIn && drop && <UniqueAuction drop={drop} marketplaceAccount={marketplaceAccount} handleBidTransaction={handleBidTransaction} />} 
      </Col>
      <Col xs={4}>
        {user.loggedIn && <Drop marketplaceAccount={marketplaceAccount} drop={drop} handleDrop={handleDrop} bidTransaction={bidTransaction} handleBidTransaction={handleBidTransaction}/>}
      </Col>
      <Col xs={3}>
        {user.loggedIn && drop && <EditionedAuction drop={drop} marketplaceAccount={marketplaceAccount} handleBidTransaction={handleBidTransaction} firstAuction={Object.keys(drop.editionsStatuses)[0]} />} 
      </Col>
    </Row>
    <Row>
      <Col> <Events /> </Col>
    </Row>
  </Grid>
  </ThemeProvider>
  </div>
  );
}

export default App;
