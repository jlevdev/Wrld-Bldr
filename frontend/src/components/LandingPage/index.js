import React, { useContext } from "react";
import styled from "styled-components";
import { Container } from "@mui/material";
import AuthContext from "context/AuthContext";
import MySettlements from "./MySettlements";
import RouteButton from "components/UI_Elements/RouteButton";

const Styled = {};

Styled.SubContainer = styled.div`
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
    <Container sx={{ paddingTop: "35vh" }}>
      <Styled.SubContainer>
        <Styled.Logo
          src="https://i.ibb.co/ZmFFp51/Untitled.png"
          alt=""
          className="wb-logo"
        />
      </Styled.SubContainer>
      <Styled.SubContainer>
        {user ? (
          <MySettlements />
        ) : (
          <>
            <RouteButton className={'cta'} text={"Login"} route={"/login"} />
            <RouteButton className={'cta'} text={"Sign Up"} route={"/register"} />
          </>
        )}
      </Styled.SubContainer>
    </Container>
  );
}

export default LandingPage;
