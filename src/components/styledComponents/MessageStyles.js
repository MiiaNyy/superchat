import styled from "styled-components";
import getMessageClr from "../../helpers/getMessageClr";

const Message = styled.div`
  width: fit-content;
  max-width: 90%;
  padding: 0.5em 0.7em;
  color: #212121;
  border-radius: ${ props=>props.msgClass === "msgSent" ? "25px 25px 2px 25px" : "25px 25px 25px 2px" };
  background-color: ${ props=>getMessageClr(props.color) };
`;

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

export {
    Message,
    MessageContainer,
    SenderInfo,
    SentTime,
}