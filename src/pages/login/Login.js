import React, { Component } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { withFirebase } from "../../components/Firebase/context";
import fire from "../../config/fire";
import * as routesUrl from "../../routesUrl";

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class LoginBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE }
  }

  loginForm = (event) => {
    const { email, password } = this.state;
    fire.auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        localStorage.setItem("login_status", true);
        window.location.href = routesUrl.HOME;
      })
      .catch(error => {
        this.setState({ error: true });
      });
    event.preventDefault();
  }
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol xs="10" md="8" lg="5">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onSubmit={(e) => this.loginForm(e)}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Email"
                          onChange={this.handleChange}
                          value={this.state.email}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          type="password"
                          id="password"
                          name="password"
                          placeholder="Password"
                          onChange={this.handleChange}
                          value={this.state.password}
                        />
                      </CInputGroup>
                      {this.state.error && <p className="text-danger">Please check your account is incorrect</p>}
                      <CRow>
                        <CCol xs="4">
                          <CButton
                            color="primary"
                            className="px-4"
                            type="submit"
                          >
                            Login
                          </CButton>
                        </CCol>
                        <CCol xs="8" className="text-right">
                          <CButton color="link" className="px-0">
                            Forgot password?
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    );
  }
}
let Login = withFirebase(LoginBase);

export default Login;
