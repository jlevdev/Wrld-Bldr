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
`;

Styled.Logo = styled.img`
  margin-bottom: 3em;
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
            <RouteButton text={"Login"} route={"/login"} />
            <RouteButton text={"Sign Up"} route={"/register"} />
          </>
        )}
      </Styled.SubContainer>
    </Container>
  );
}

export default LandingPage;
