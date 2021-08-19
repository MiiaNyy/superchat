import styled from "styled-components";

const Message = styled.div`
  width: fit-content;
  max-width: 90%;
  padding: 0.5em 0.7em;
  color: #212121;
  border-radius:  ${props => props.msgClass === "msgSent" ? "25px 25px 2px 25px" : "25px 25px 25px 2px"} ;
  background-color: ${props => getMessageClr(props.color)} ;
  margin-left: ${props => props.msgClass === "msgSent" ? "auto" : "0.5em"} ;
  margin-right: ${props => props.msgClass === "msgSent" ? "0.5em" : "initial"} ;
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


export {
    Message
}