
import styled from 'styled-components'

export const UniqueAuctionBox = styled.div`
    margin-top: 200px;
    margin-left: 100px;

    table {
        font-size: 0.8em;
        text-align: left;
    }
    th {
        border-bottom: 1px solid black;
    }
   
`

export const Winning = styled.span`
background: rgba(61, 215, 58, 0.2); 
border-radius: 4.5px;
color: #3DD73A;
text-align: center;
padding: 10px;

`

export const Loosing = styled.span`
background: rgba(250, 32, 32, 0.2); 
border-radius: 4.5px;
color: #FA2020;
text-align: center;
padding: 10px;


`

export const Tie = styled.span`
background: rgba(170, 173, 30, 0.2); 
border-radius: 4.5px;
color: #AAAD1E;
text-align: center;
padding: 10px;


`


export const EditionedAuctionBox = styled.div`
    margin-top: 200px;
    text-align: right;
    color: black;
    margin-right: 100px;

    table {
        float: right;
        font-size: 0.8em;
    }

    th {
        border-bottom: 1px solid black;

    }
  
`

export const Title = styled.h1`

`

export const Price = styled.span`
    font-size: 1.8em;
`