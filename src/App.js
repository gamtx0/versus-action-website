import React, {useState, useEffect} from "react"
import styled from 'styled-components'

import Section from './components/Section'
import Header from './components/Header'

import Authenticate from './demo/Authenticate'
import VersusProfile from './demo/VersusProfile'
import Drop from './demo/Drop'
import UniqueAuction from './demo/UniqueAuction'

import * as fcl from "@onflow/fcl"
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

  useEffect(() =>
    fcl
      .currentUser()
      .subscribe(user => setUser({...user}))
  , [])
  
  return (
    <Wrapper>
      <Section>
        <Header>VERSUS</Header>
        <Authenticate user={user} />
        {user.loggedIn && <VersusProfile user={user} bidTransaction={bidTransaction}/>}
        {user.loggedIn && <Drop marketplaceAccount={marketplaceAccount} drop={drop} handleDrop={handleDrop} bidTransaction={bidTransaction} handleBidTransaction={handleBidTransaction}/>}
        {user.loggedIn && drop && <UniqueAuction drop={drop} marketplaceAccount={marketplaceAccount} handleBidTransaction={handleBidTransaction} />} 
      </Section>
    </Wrapper>
  );
}

export default App;
