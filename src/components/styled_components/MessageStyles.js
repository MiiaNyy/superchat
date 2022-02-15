import styled from "styled-components";
import getMessageClr from "../../helpers/getMessageClr";

const Message = styled.div`
  width: fit-content;
  max-width: 90%;
  padding: 0.5em 0.7em;
  color: #212121;
  border-radius: ${ props=>props.msgClass === "msg__sent" ? "25px 25px 2px 25px" : "25px 25px 25px 2px" };
  background-color: ${ props=>getMessageClr(props.color) };
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: ${ props=>props.msgClass === "msg__sent" ? "row-reverse" : "row" };
`;

const SenderInfo = styled.p`
  font-size: 0.6rem;
  font-style: italic;
  margin-left: ${ props=>props.msgClass === "msg__sent" ? "auto" : "3em" };
  margin-right: ${ props=>props.msgClass === "msg__sent" ? "3em" : "initial" };
  text-align: ${ props=>props.msgClass === "msg__sent" ? "right" : "left" };
  @media (min-width: 700px) {
    font-size: 0.8rem;
  }
`;

const SentTime = styled(SenderInfo)`
  font-size: 0.5rem;
  color: black;
  letter-spacing: 1px;
  margin-left: ${ props=>props.msgClass === "msg__sent" ? "auto" : "0" };
  margin-right: ${ props=>props.msgClass === "msg__sent" ? "0" : "initial" };
  @media (min-width: 700px) {
    font-size: 0.6rem;
  }
`;

export {
    Message,
    MessageContainer,
    SenderInfo,
    SentTime,
}