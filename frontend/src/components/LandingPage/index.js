import React, { useContext } from "react";
import styled from "styled-components";
import AuthContext from "context/AuthContext";
import MySettlements from "./MySettlements";
import RouteButton from "components/UI_Elements/RouteButton";

const Styled = {};

Styled.LogoContainer = styled.div`
  margin-top: 30vh;
  display: flex;
  justify-content: center;

  & button {
    margin: 0 10px;
  }
`;

Styled.Container = styled.div`
  display: flex;
  justify-content: center;

  & button {
    margin: 0 10px;
  }
`;

Styled.Logo = styled.img`
  margin-bottom: 30px;
  width: 30vw;
`;

function LandingPage() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Styled.LogoContainer>
        <Styled.Logo
          src="https://i.ibb.co/ZmFFp51/Untitled.png"
          alt=""
          className="wb-logo"
        />
      </Styled.LogoContainer>
      <Styled.Container>
        {user ? (
          <MySettlements />
        ) : (
          <>
            <RouteButton className={'cta'} text={"Login"} route={"/login"} />
            <RouteButton className={'cta'} text={"Sign Up"} route={"/register"} />
          </>
        )}
      </Styled.Container>
    </>
  );
}

export default LandingPage;
