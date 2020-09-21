import React from "react";
import styled from "styled-components";
import * as fcl from "@onflow/fcl";

const Link = styled.a`
  color: #979797;
  text-decoration: none;
  transition: color 0.45s;

  &:hover {
    color: #eee;
    transition: color 0.45s;
  }
`;
const Authenticate = ({ user: { loggedIn } }) => {
  const signInOrOut = async (event) => {
    event.preventDefault();

    if (loggedIn) {
      fcl.unauthenticate();
    } else {
      fcl.authenticate();
    }
  };

  return (
    <Link href="#" onClick={signInOrOut}>
      {loggedIn ? "Sign Out" : "Sign In/Up"}
    </Link>
  );
};

export default Authenticate;
