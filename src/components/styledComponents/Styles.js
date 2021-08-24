import styled from "styled-components";

const Main = styled.main`
  width: 100%;
  max-height: 100vh;
  max-width: 700px;
  display: ${props => props.grid ? 'grid': 'block'};
  grid-template-columns: ${props => props.grid ? '200px repeat(2, 1fr)' : 'none'};
  grid-template-rows: ${props => props.grid ? '60px repeat(3, 1fr) 80px' : 'none'};
  background-color: #2d2d2d;
  color: #e7e7e7;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
  transition: all 0.3s ease-in-out;
`;

const SignInSection = styled.div`
  width: 100%;
  max-width: 500px;
  min-height: 300px;

  padding: 1em;
  margin: 0 auto;
  text-align: center;

  & > header h1 {
    border-bottom: 2px solid #7e8ce0;
  }

  & > section {
    width: 100%;
    max-width: 400px;
    margin: 2em auto;
    & > p {
      font-weight: bolder;
      letter-spacing: 1px;
    }
  }


`;


const Message = styled.div`
  width: fit-content;
  max-width: 90%;
  padding: 0.5em 0.7em;
  color: #212121;
  border-radius: ${ props=>props.msgClass === "msgSent" ? "25px 25px 2px 25px" : "25px 25px 25px 2px" };
  background-color: ${ props=>getMessageClr(props.color) };

`;

function getMessageClr(clr) {
    switch (clr) {
        case('yellow'):
            return '#FFC68A';
        case ('green'):
            return '#4acfac';
        case('pink'):
            return '#ffa2bb';
        case ('purple'):
            return '#7e8ce0';
        case('blue'):
            return '#36c7d0';
    }
}


const MessageContainer = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: ${ props=>props.msgClass === "msgSent" ? "row-reverse" : "row" };
`;

const SenderInfo = styled.p`
  font-size: 0.7rem;
  font-style: italic;
  margin-left: ${ props=>props.msgClass === "msgSent" ? "auto" : "3em" };
  margin-right: ${ props=>props.msgClass === "msgSent" ? "3em" : "initial" };
  text-align: ${ props=>props.msgClass === "msgSent" ? "right" : "left" };
`;

const SentTime = styled(SenderInfo)`
  font-size: 0.6rem;
  color: black;
  letter-spacing: 1px;
  margin-left: ${ props=>props.msgClass === "msgSent" ? "auto" : "0" };
  margin-right: ${ props=>props.msgClass === "msgSent" ? "0" : "initial" };
`;


const UserColor = styled.div`
  padding: 0.5em;
  border-radius: 50px;
  background-color: ${ props=>getMessageClr(props.color) };`;

export {
    Main,
    SignInSection,
    Message,
    MessageContainer,
    SenderInfo,
    UserColor,
    SentTime,
}