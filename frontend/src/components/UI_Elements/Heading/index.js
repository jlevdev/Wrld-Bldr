import styled from "styled-components";

const Styled = {};

Styled.H1 = styled.h1`
  font-family: ${(props) => props.theme.fontFamily.primary};
  font-size: ${(props) => props.theme.fontSizes.h1};
  font-weight: 300;
  margin: 0;
`;

Styled.H2 = styled.h2`
  font-family: ${(props) => props.theme.fontFamily.primary};
  font-size: ${(props) => props.theme.fontSizes.h2};
  font-weight: 300;
  margin: 0;
`;

Styled.H3 = styled.h3`
  font-family: ${(props) => props.theme.fontFamily.primary};
  font-size: ${(props) => props.theme.fontSizes.h3};
  font-weight: 300;
  margin: 0;
`;

export const Heading = (props) => {
  const { size = 1, children, ...restProps } = props;
  return (
    <>
      {(size == 1 || !size) && <Styled.H1 {...restProps}>{children}</Styled.H1>}
      {size == 2 && <Styled.H2 {...restProps}>{children}</Styled.H2>}
      {size == 3 && <Styled.H3 {...restProps}>{children}</Styled.H3>}
    </>
  );
};

export default Heading;
