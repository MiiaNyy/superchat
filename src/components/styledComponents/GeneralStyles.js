import styled from "styled-components";
import getMessageClr from "../../helpers/getMessageClr";

const Main = styled.main`
  width: 100%;
  max-height: 97vh;
  min-height: 95vh;
  max-width: 700px;
  display: grid;
  grid-template-columns: 200px repeat(2, 1fr);
  grid-template-rows: 60px repeat(3, 1fr) 80px;
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


const UserColor = styled.div`
  padding: 0.5em;
  border-radius: 50px;
  background-color: ${ props=>getMessageClr(props.color) };`;


export {
    Main,
    SignInSection,
    UserColor,
}