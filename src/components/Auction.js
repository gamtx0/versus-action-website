
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
background: rgba(161, 192, 132, 0.6); 
border-radius: 8px;
color: black;
text-align: center;
padding: 15px;

`

export const Loosing = styled.span`
background: rgba(224, 82, 99, 0.6); 
border-radius: 8px;
color: black;
text-align: center;
padding: 15px;


`

export const Tie = styled.span`
background: rgba(255, 202, 177, 0.6); 
border-radius: 8px;
color: black;
text-align: center;
padding: 15px;


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