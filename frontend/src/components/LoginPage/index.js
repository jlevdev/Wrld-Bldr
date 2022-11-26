import { useContext } from "react";
import AuthContext from "context/AuthContext";
import Panel from "components/Panel";
import styled from "styled-components";
import UsernameField from "components/UI_Elements/UsernameField";
import PasswordField from "components/UI_Elements/PasswordField";
import SubmitButton from "components/UI_Elements/SubmitButton";
import Heading from "components/UI_Elements/Heading";
import RouteButton from "components/UI_Elements/RouteButton";

const Styled = {};

Styled.Container = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20vh;
`;

Styled.Form = styled.form`
  display: flex;
  flex-direction: column;
`;

Styled.Panel = styled(Panel)`
  justify-content: center;
  text-align: center;
`;

Styled.LeftPane = styled.div`
`;

Styled.RightPane = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  & * {
    margin: 10px 0;
  }
`;

Styled.VR = styled.div`
  height: 100%;
  width: 1px;
  background: black;
  margin: 0 40px;
`;

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const handleSubmit = e => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    username.length > 0 && loginUser(username, password);
  };

  return (
    <Styled.Container>
      <Styled.Panel>
        <Styled.LeftPane>
          <Styled.Form onSubmit={handleSubmit}>
            <Heading size={1} style={{ marginBottom: '10px' }}>Login</Heading>
            <UsernameField />
            <PasswordField showForgotPassword={true} />
            <SubmitButton>
              Submit
            </SubmitButton>
          </Styled.Form>
        </ Styled.LeftPane>
        <Styled.VR />
        <Styled.RightPane>
          <Heading size={3}>Don't have an account yet?</Heading>
          <RouteButton text={"Sign Up"} route={"/register"} />
        </Styled.RightPane>
      </Styled.Panel>
    </Styled.Container >
  );
};

export default LoginPage;