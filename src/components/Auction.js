import styled from "styled-components";

export const UniqueAuctionBox = styled.div`
  margin-top: 100px;
`;

export const Winning = styled.span`
  background: rgba(61, 215, 58, 0.2);
  border-radius: 4.5px;
  color: #3dd73a;
  display: block;
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
  text-align: center;
  margin: 23px 0;
  max-width: 100px;
  padding: 6px 0;
  width: 100%;
`;

export const Loosing = styled.span`
  background: rgba(250, 32, 32, 0.2);
  border-radius: 4.5px;
  color: #fa2020;
  display: block;
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
  text-align: center;
  margin: 23px 0;
  max-width: 100px;
  padding: 6px 0;
  width: 100%;
`;

export const Tie = styled.span`
  background: rgba(170, 173, 30, 0.2);
  border-radius: 4.5px;
  color: #aaad1e;
  display: block;
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
  text-align: center;
  margin: 23px 0;
  max-width: 100px;
  padding: 6px 0;
  width: 100%;
`;

export const EditionedAuctionBox = styled.div`
  margin-top: 100px;
  text-align: right;
  color: black;
`;

export const Title = styled.h1`
  font-size: 24px;
  line-height: 28px;
  margin-bottom: 10px;
`;

export const Subtitle = styled.div`
  color: white;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 19px;

  span {
    text-decoration: underline;
  }
`;

export const Pretext = styled.span`
  display: block;
  font-size: 13px;
  margin-bottom: 10px;
`;

export const Price = styled.span`
  display: block;
  font-size: 31px;
  line-height: 36px;
`;

export const History = styled.div`
  margin-top: 43px;

  span {
    font-size: 14px;
    text-align: left;

    span {
      font-weight: 700;
    }
  }
`;
