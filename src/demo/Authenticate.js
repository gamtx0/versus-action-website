import React from "react"
import styled from "styled-components"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'

const Profile = styled.div`
  margin-bottom: 10px;
`
const Img = styled.img`
  width: 50px;
  height: 50px;
`

const SignInOutButton = ({ user: { loggedIn } }) => {
  const signInOrOut = async (event) => {
    event.preventDefault()

    if (loggedIn) {
      fcl.unauthenticate()
    } else {
      fcl.authenticate()
    }
  }

  return (
    <button onClick={signInOrOut}>
      {loggedIn ? 'Sign Out' : 'Sign In/Up'}
    </button>
  )
}

// TODO: Tweak profile or move to versus profile?
const UserProfile = ({ user }) => {
   return (
    <Profile>
      {user.identity.avatar && <Img src={user.identity.avatar} />}

     <div>
        <b>Name</b>: {user.identity.name || "Anonymous"}
      </div>
      <div>
        <b>Address</b>: {user.addr || ""}
      </div>
    </Profile>
  )
}

const Authenticate = ({ user}) => {
  return (
    <Card>
      {user.loggedIn && <UserProfile user={user} />}

      <SignInOutButton user={user} />
    </Card>
  )
}

export default Authenticate

