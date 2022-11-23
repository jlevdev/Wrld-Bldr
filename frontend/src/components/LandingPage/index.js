import React from "react";
import styled from "styled-components";
import { Container } from "@mui/material";

const Styled = {};

Styled.SubContainer = styled.div`
  display: flex;
  justify-content: center;
`;

Styled.Logo = styled.img`
  margin-bottom: 3em;
  width: 50vw;
`;

function LandingPage() {
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
        <h3>Stuff goes here</h3>
      </Styled.SubContainer>
    </Container>
  );
}

export default LandingPage;
