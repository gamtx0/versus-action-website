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

export const BidFieldset = styled.div`
  border: 0;
  padding: 0px;

  .text-label {
    align-self: flex-end;
    display: flex;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1%;
  }
`;

export const PriceFieldWrapper = styled.div`
  position: relative;
  max-width: 211px;
  min-height: 43px;
  width: 100%;

  label,
  input {
    font-size: inherit;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    padding: 0.5em;
  }

  label {
    background: black;
    color: white;
    line-height: 25px;
    z-index: 2;
  }

  input {
    background: transparent;
    border: none; // reset user agent styles
    border-bottom: 1px solid #d3d8dd;
    cursor: input;
    padding-left: 60px;
    padding-right: 0;
    text-align: right;
    width: 100%;
    z-index: 1;
  }
`;

export const SelectFieldWrapper = styled.div`
  border-bottom: 1px solid #d3d8dd;
  margin-bottom: 21px;
  max-width: 211px;
  width: 100%;
`;

export const Select = styled.select`
  background: transparent;
  text-align: right;
  border: none;
  border-bottom: 2px solid #d3d8dd
  max-width: 198px;
  width: 100%;
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

export const EditionInfo = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;

  margin-bottom: 27px;
  max-width: 211px;
  padding-top: 21px;

  font-size: 13px;
  width: 100%;

  .label {
    text-align: left;
  }

  .data {
    display: flex;
    flex-direction: column;
    text-align: right;

    &__price-wrap {
      &__currency-label {
        padding-right: 2px;
      }
      &__price {
        font-size: 17px;
        font-weight: 700;
        line-height: 12.89px;
      }
    }
  }
`;
