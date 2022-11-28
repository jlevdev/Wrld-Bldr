import styled from "styled-components";
import React from "react";
import usePaper from "hooks/usePaper";

const Styled = {};

Styled.Container = `
  display: flex;
`;

function Settlement() {
  const { activeSettlement } = usePaper();

  return (
    <div id="Settlement">

    </div>
  );
}

export default Settlement;
