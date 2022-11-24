import React from "react";
import styled from "styled-components";

const Styled = {};

Styled.MySettlementsContainer = styled.div``;

Styled.Grid = styled.div``;

Styled.GridItem = styled.div``;

Styled.SettlementImage = styled.div``;

Styled.SettlementTitle = styled.div``;

Styled.SettlementOptions = styled.div``;


function MySettlements() {
    const mySettlements = [];

    return (
        <Styled.MySettlementsContainer>
            <Styled.Grid>
                {mySettlements.map(s => (
                    <Styled.GridItem>
                        <Styled.SettlementImage />
                        <Styled.SettlementTitle>

                        </Styled.SettlementTitle>
                        <Styled.SettlementOptions />
                    </Styled.GridItem>
                ))}

            </Styled.Grid>
        </ Styled.MySettlementsContainer>

    );

}

export default MySettlements;
