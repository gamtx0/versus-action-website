import React from 'react';
import styled from 'styled-components'

import Section from './components/Section'
import Header from './components/Header'

import Authenticate from './demo/Authenticate'
import SetupUser from './demo/SetupUser'
import CheckAccount from './demo/CheckAccount'
import CheckCurrentUser from './demo/CheckCurrentUser'
import Bid from './demo/Bid'

const Wrapper = styled.div`
  font-size: 13px;
  font-family: Arial, Helvetica, sans-serif;
`;

function App() {
  return (
    <Wrapper>
      <Section>
        <Header>FCL wallet interactions</Header>
        <Authenticate />
        <CheckCurrentUser />
        <SetupUser />
        <Bid />
      </Section>
    </Wrapper>
  );
}

export default App;
