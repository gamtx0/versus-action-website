import styled from 'styled-components'

export const BidButton= styled.input`
background-color: #FA2061;
mix-blend-mode: normal;
opacity: 0.9;
border-radius: 8px;
text-align: center;
font-size: 14px;
color: white;
font-size: inherit;
padding: 0.5em;    
margin-left: 5px;
-moz-box-sizing: content-box;
cursor:pointer;
-webkit-box-sizing: content-box;
box-sizing: content-box;
width: 200px;

 &:hover {
     opacity: 0.7;
 }
`

export const BidFieldset=styled.fieldset`
border: 0;
font-size: 1em;
padding: 0px;

`
export const Label=styled.label`
font-size: inherit;
-moz-box-sizing: content-box;
-webkit-box-sizing: content-box;
box-sizing: content-box;
background: black;
color: white;
border: 1px solid black;
padding: 0.5em;
border-radius: 8px 0px 0px 8px;
`

export const Select=styled.select`
background: transparent;
text-align: right;
border: 1px solid black;
width: 275px;
padding: 0.4em;
font-size: inherit;
-moz-box-sizing: content-box;
-webkit-box-sizing: content-box;
box-sizing: content-box;
border-radius: 0px 8px 8px 0px;
cursor:pointer;
`

export const PriceInput=styled.input`
background: transparent;
text-align: right;
border: 1px solid black;
width: 070px;
cursor: input;
padding: 0.5em;
font-size: inherit;
-moz-box-sizing: content-box;
-webkit-box-sizing: content-box;
box-sizing: content-box;
border-radius: 0px 8px 8px 0px;
`