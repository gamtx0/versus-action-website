import styled from "styled-components";

export const BidButton = styled.input`
  background-color: #fa2061;
  -moz-box-sizing: content-box;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  border: none;
  border-radius: 8px;
  color: white;
  display: block;
  font-size: 14px;
  line-height: 19px;
  margin-top: 21px;
  max-width: 211px;
  padding: 12px 0;
  text-align: center;
  transition: background-color 0.5s;
  width: 100%;

  &:hover {
    background-color: darken(#fa2061, 15%);
    cursor: pointer;
    transition: background-color 0.5s;
  }
`;

export const BidFieldset = styled.fieldset`
  border: 0;
  padding: 0px;
`;

export const Label = styled.label`
  font-size: inherit;
  -moz-box-sizing: content-box;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  background: black;
  color: white;
  border: 1px solid black;
  padding: 0.5em;
  border-radius: 8px 0px 0px 8px;
`;

export const Select = styled.select`
  background: transparent;
  text-align: right;
  border: 1px solid black;
  width: 275px;
  padding: 0.4em;
  height: 22px;
  font-size: inherit;
  -moz-box-sizing: content-box;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  border-radius: 0px 8px 8px 0px;
  cursor: pointer;
  margin-bottom: 2px;
`;

export const PriceInput = styled.input`
  background: transparent;
  text-align: right;
  border: 1px solid black;
  width: 70px;
  cursor: input;
  padding: 0.5em;
  font-size: inherit;
  -moz-box-sizing: content-box;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  border-radius: 0px 8px 8px 0px;
`;
