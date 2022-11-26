import { useState, useContext, useEffect } from "react";
import AuthContext from "context/AuthContext";
import Panel from "components/Panel";
import styled from "styled-components";
import UsernameField from "components/UI_Elements/UsernameField";
import PasswordField from "components/UI_Elements/PasswordField";
import SubmitButton from "components/UI_Elements/SubmitButton";
import Heading from "components/UI_Elements/Heading";

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

Styled.PasswordsDontMatch = styled.div`
  font-size: ${(props) => props.theme.fontSizes.small};
  color: red;
`;

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(username, password, password2);
  };

  return (
    <Styled.Container>
      <Styled.Panel>
        <Styled.Form onSubmit={handleSubmit}>
          <Heading size={1} style={{ marginBottom: "10px" }}>
            Register
          </Heading>
          <UsernameField
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <PasswordField
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordField
            name={"confirm-password"}
            id={"confirm-password"}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          <Styled.PasswordsDontMatch
            style={{ marginBottom: password2 !== password ? "10px" : "" }}
          >
            {password2 !== password ? "Passwords do not match" : ""}
          </Styled.PasswordsDontMatch>
          <SubmitButton>Register</SubmitButton>
        </Styled.Form>
      </Styled.Panel>
    </Styled.Container>
  );
}

export default Register;
