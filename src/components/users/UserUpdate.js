import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CFormText,
  CInput,
  CLabel,
  CRow,
  CSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as routesUrl from '../../routesUrl'
import firebase from '../../config/fire';
import validateError from "../../common/validateError";
import ValidateInput from "../../common/validateInput";
import Toast from "../../common/Toast";

const INITAL_STATE = {
  firstName: "",
  lastName: "",
  password: "",
  phone: "",
  role: "",
  sellerId: "",
}

class UserUpdate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      passwordConfirm: "",
      showPasswordConfirm: false,
      content: "",
      errors: {
        email: false,
        firstName: false,
        lastName: false,
        password: false,
        passwordConfirm: false,
        phone: false,
        role: false,
        sellerId: false,
      }
    }
  }

  componentDidMount() {
    if (this.state.user) {
      return;
    }
    if (this.props.match.params.id) {
      this.setState({ loading: true });

      firebase.database().ref(`users/${this.props.match.params.id}`)
        .on('value', snapshot => {
          this.setState({
            user: snapshot.val(),
          });
        });
    } else {
      let { user } = this.state
      user = INITAL_STATE
      this.setState({ user, showPasswordConfirm: true })
    }
  }

  componentWillUnmount() {
    firebase.database().ref(`users/${this.props.match.params.id}`).off();
  }

  handleChange = (event) => {
    let { user, errors } = this.state
    let stateValue = event.target.value
    let stateName = event.target.name

    user[stateName] = stateValue
    errors[stateName] = false
    this.handleUpdate(stateName, user)
    this.setState({ user, errors })
  }

  handleUpdate = (stateName, user) => {
    switch (stateName) {
      case "firstName":
      case "lastName":
        user["fullName"] = user.lastName + " " + user.firstName
        break;
      case "email":
        this.validateField(stateName, validateError.getInputError(user.email, stateName))
        break;
      case "phone":
        this.validateField(stateName, validateError.getInputError(user.phone, stateName))
        break;
      case "password":
        this.validateField(stateName, validateError.getInputError(user, stateName))
        break;
      default:
        break;
    }
    this.setState({ user })
  }

  validateField = (stateName, value) => {
    let { errors } = this.state;
    errors[stateName] = value
    this.setState({ errors })
  }

  handleSave = () => {
    let isValid = true
    let { user, errors, showPasswordConfirm, passwordConfirm } = this.state

    if (showPasswordConfirm) {
      user.passwordConfirm = user.password === passwordConfirm ? passwordConfirm : ""
    } else {
      delete user.passwordConfirm
    }

    Object.keys(user).forEach((key) => {
      if (user[key] === "" && key !== "fullname") {
        errors[key] = true
      } else {
        errors[key] = false
      }
    })
    this.setState({ errors })

    Object.keys(errors).forEach((key) => errors[key] === true && (isValid = false))

    if (isValid) {
      delete user.passwordConfirm
      this.updateUser(user)

    } else {
      this.setState({content:"this user has data incorrect!"});
    }
  }

  updateUser = (user) => {
    let refUser = firebase.database().ref(`users/${this.props.match.params.id}`)

    refUser.update(user)
      .then(() => {
        this.setState({ showPasswordConfirm: false, content:"this user updated sucess" })
      })
      .catch((error) => {
        this.setState({content:"update user incorrect"});
      })
  }

  handleChangePassword = (event) => {
    let { user, errors } = this.state
    let currentPassword = user.password
    let stateValue = event.target.value
    let stateName = event.target.name

    if (stateName === "password") {
      this.handleUpdate(stateName, stateValue)
      if (stateValue !== currentPassword) {
        user[stateName] = stateValue
        this.setState({ showPasswordConfirm: true, user })
      } else {
        this.setState({content:"New password must be different from the old password"});
      }
    } else {
      if (stateValue !== currentPassword) {
        errors["passwordConfirm"] = true
      } else {
        errors["passwordConfirm"] = false
      }
      this.setState({ passwordConfirm: stateValue, errors });
    }
  }

  handleClose = () => {
    this.props.history.push(routesUrl.LIST_USERS)
  }

  render() {
    const { user, passwordConfirm, errors, showPasswordConfirm, content } = this.state;
    const invalidValue = [undefined, null]

    return (
      user &&
      <div>
      {content && <Toast content={content}/>}
      <CRow className="justify-content-center">
        <CCol xs="12" md="6" >
          <CCard>
            <CCardHeader>
              <span>Detail User: </span>
              <span className="font-weight-bold"> {user.fullName}</span>
            </CCardHeader>
            <CCardBody>
              <CForm className="form-horizontal">

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="font-weight-bold">First Name</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      name="firstName"
                      placeholder="First Name"
                      value={invalidValue.includes(user.firstName) ? "" : user.firstName}
                      onChange={this.handleChange}
                    />
                    {errors.firstName && <CFormText className="text-danger">Please enter your first name</CFormText>}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="font-weight-bold">Last Name</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      name="lastName"
                      placeholder="Last Name"
                      value={invalidValue.includes(user.lastName) ? "" : user.lastName}
                      onChange={this.handleChange}
                    />
                    {errors.lastName &&<CFormText className="text-danger">Please enter your last name</CFormText>}
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="font-weight-bold">Emaill</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      name="email"
                      value={invalidValue.includes(user.email) ? "" : user.email}
                      onChange={this.handleChange}
                    />
                    {errors.email && <CFormText className="text-danger">Please enter email correct</CFormText>}
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="font-weight-bold">Phone</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      name="phone"
                      placeholder="Phone"
                      value={user.phone}
                      onChange={event => {
                        if (ValidateInput.verifyNumber(event.target.value)) {
                          this.handleChange(event)
                        }
                      }}
                    />
                    {errors.phone && <CFormText className="text-danger">Please enter phone correct</CFormText>}
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="font-weight-bold">Password</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={user.password}
                      onChange={this.handleChangePassword}
                      required
                    />
                    {errors.password && <CFormText className="text-danger">Please enter password correct</CFormText>}
                  </CCol>
                </CFormGroup>
                {showPasswordConfirm &&
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel className="font-weight-bold">Password confirm</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput
                        type="password"
                        name="passwordConfirm"
                        required={errors.passwordConfirm}
                        placeholder="Password confirm"
                        value={passwordConfirm}
                        onChange={this.handleChangePassword}
                      />
                      {errors.passwordConfirm && <CFormText className="text-danger">passwordConfirm not match password</CFormText>}
                    </CCol>
                  </CFormGroup>
                }

                <CFormGroup row >
                  <CCol xs="6">
                    <CFormGroup>
                      <CLabel className="font-weight-bold">Role</CLabel>
                      <CSelect
                        name="role"
                        placeholder="role"
                        value={user.role}
                        onChange={this.handleChange}
                      >
                        <option value="Seller">Seller</option>
                        <option value="Buyer">Buyer</option>
                      </CSelect>
                    </CFormGroup>
                  </CCol>

                  <CCol xs="6">
                    <CFormGroup>
                      <CLabel className="font-weight-bold">Status</CLabel>
                      <CSelect
                        name="status"
                        placeholder="role"
                        value={user.status}
                        onChange={this.handleChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Pause">Pause</option>
                      </CSelect>
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton className="mr-3" size="sm" color="success" onClick={this.handleSave}><CIcon name="cil-check" />SAVE</CButton>
              <CButton size="sm" color="danger" onClick={this.handleClose}><CIcon name="cil-X" /> CANCEL</CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
      </div>
    )
  }
}


export default UserUpdate