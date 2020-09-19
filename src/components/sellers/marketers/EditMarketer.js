import React from "react";
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
  CTextarea,
  CImg
} from "@coreui/react";
import CIcon from '@coreui/icons-react'
import * as routesUrl from "../../../routesUrl";
import firebase from "../../../config/fire";
import validateError from "../../../common/validateError";
import ValidateInput from "../../../common/validateInput"
import { ToastContainer, toast } from 'react-toastify';

const INITAL_STATE = {
  image: "",
  location: {
    address: ""
  },
  name: "",
  phone: "",
  starRating: 1,
};

class EditMarketer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      marketers: null,
      imageAsFile: "",
      errors: {
        firstName: false,
        image: false,
        address: false,
        name: false,
        phone: false,
        starRating: false,
      },
    };
  }

  componentDidMount = () => {
    let { marketers } = this.state
    if (this.props.match.params.id) {

      firebase.database().ref(`marketers/${this.props.match.params.id}`)
        .on('value', snapshot => {
          this.setState({
            marketers: snapshot.val(),
          });
        });
    } else {
      marketers = INITAL_STATE
      this.setState({ marketers })
    }
  }

  componentWillUnmount() {
    firebase.database().ref(`marketers/${this.props.match.params.id}`).off();
  }

  handleChange = (event) => {
    let { marketers, errors } = this.state;
    let stateValue = event.target.value;
    let stateName = event.target.name;
    marketers[stateName] = stateValue
    errors[stateName] = false;
    if (stateName === "phone") {
      errors[stateName] = validateError.getInputError(stateValue, stateName)
    }
    this.setState({ marketers, errors });
  };

  handleChangeAddress = (event) => {
    let { errors } = this.state
    let stateValue = event.target.value;
    this.setState(prevState => ({
      marketers: {
        ...prevState.marketers,
        location: {
          ...prevState.marketers.location,
          address: stateValue
        }
      },
      errors
    }))
  }

  handleChangeImage = async (e) => {
    let image = e.target.files[0]
    await this.setState({ imageAsFile: image })
    this.uploadImage()
  }

  uploadImage = () => {
    let { imageAsFile, marketers, errors } = this.state;

    const storage = firebase.storage()
    if (imageAsFile === '') {
      toast.error(`Not an image, the image file is a ${typeof (imageAsFile)}`)
    }
    const uploadTask = storage.ref(`/images/${imageAsFile.name}`).put(imageAsFile)
    uploadTask.on('state_changed',
      (snapShot) => {
      }, (err) => {
      }, () => {
        storage.ref('images').child(imageAsFile.name).getDownloadURL()
          .then(fireBaseUrl => {
            marketers["image"] = fireBaseUrl
            errors["image"] = false
            this.setState(prevObject => ({ ...prevObject, marketers, errors }))
          })

      })
  }

  handleSave = () => {
    let isValid = true;
    let { marketers, errors } = this.state;

    Object.keys(marketers).forEach((key) => {
      if (marketers[key] === "") {
        errors[key] = true;
      } else if (marketers["location"]['address'] === "") {
        errors["address"] = true;
      }
      else {
        errors[key] = false;
      }
    });
    this.setState({ errors });

    Object.keys(errors).forEach(
      (key) => errors[key] === true && (isValid = false)
    );

    if (isValid) {
      this.EditMarketer(this.state.marketers);
    } else {
      toast.error("This marketer has data incorrect!");
    }
  };

  EditMarketer = (marketers) => {
    const ref = firebase.database().ref(`marketers/${this.props.match.params.id}`);
    ref.update(marketers)
      .then(() => {
        toast.success("This marketer update success");
        setTimeout(() => {
          this.props.history.push(routesUrl.LIST_MARKETER)
        }, 3000)
      })
      .catch((error) => {
        toast.error("This marketer update unsuccess");
      });
  };

  handleButton = () => {
    this.inputRef.click();
  }

  handleClose = () => {
    this.props.history.push(routesUrl.LIST_MARKETER);
  };

  render() {
    const { marketers, errors } = this.state;
    const invalidValue = [undefined, null];

    return (
      marketers && (
        <div>
          <ToastContainer />
          <CRow className="justify-content-center">
            <CCol xs="12" md="6">
              <CCard>
                <CCardHeader>
                  <span style={{ margin: '0 auto', fontWeight: 'bold' }}>Marketers Form</span>
                </CCardHeader>
                <CCardBody>
                  <CForm className="form-horizontal">
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel className="font-weight-bold">Name</CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <CInput
                          name="name"
                          placeholder="Enter marketer name"
                          value={invalidValue.includes(marketers.name) ? "" : marketers.name}
                          onChange={this.handleChange}
                        />
                        {errors.name && <CFormText className="text-danger">Please enter your marketer name</CFormText>}
                      </CCol>
                    </CFormGroup>

                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel className="font-weight-bold">Phone Number</CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <CInput
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={marketers.phone}
                          onChange={event => {
                            if (ValidateInput.verifyNumber(event.target.value)) {
                              this.handleChange(event)
                            }
                          }}
                        />
                        {errors.phone && <CFormText className="text-danger">Please enter your phone number</CFormText>}
                      </CCol>
                    </CFormGroup>

                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel className="font-weight-bold">Star Rating</CLabel>
                      </CCol>
                      <CCol xs="12" md="3">
                        <CSelect
                          name="starRating"
                          placeholder="start"
                          value={marketers.starRating}
                          onChange={this.handleChange}
                        >
                          <option value="1">1 star</option>
                          <option value="2">2 star</option>
                          <option value="3">3 star</option>
                          <option value="4">4 star</option>
                          <option value="5">5 star</option>
                        </CSelect>
                      </CCol>
                      <CCol md="2" className="text-right">
                        <CLabel className="font-weight-bold">Image</CLabel>
                      </CCol>
                      <CCol xs="12" md="4" >
                        <CImg className="image border border-primary rounded mr-3" src={marketers.image} />
                        <CButton
                          onClick={this.handleButton}
                          className="upload-img btn-sm btn-outline-success"
                        >
                          <span className="fas fa-upload mr-1"></span>
                          Upload
                        </CButton>
                        <input
                          type="file"
                          className="d-none"
                          name="image"
                          onChange={this.handleChangeImage}
                          accept="image/png, image/jpeg"
                          ref={(ref) => this.inputRef = ref}
                        />
                        {errors.image && <CFormText className="text-danger">Please choosen image</CFormText>}
                      </CCol>
                    </CFormGroup>

                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel className="font-weight-bold">Address</CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <CTextarea
                          rows="5"
                          placeholder="Address"
                          value={invalidValue.includes(marketers.location.address) ? "" : marketers.location.address}
                          onChange={this.handleChangeAddress}
                        />
                        {errors.address && <CFormText className="text-danger">Please enter your address</CFormText>}
                      </CCol>
                    </CFormGroup>

                  </CForm>
                </CCardBody>
                <CCardFooter>

                  <CButton
                    className="mr-3 font-weight-bold"
                    size="sm"
                    color="success"
                    onClick={this.handleSave}
                  >
                    <CIcon name="cil-check" style={{
                      margin: '0 0.3rem',
                      verticalAlign: 'sub'
                    }} />
                    SAVE
                </CButton>

                  <CButton
                    className="font-weight-bold"
                    size="sm"
                    color="danger"
                    onClick={this.handleClose}>
                    <CIcon name="cil-X" style={{
                      margin: '0 0.3rem',
                      verticalAlign: 'sub'
                    }} />
                    CANCEL
                </CButton>
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>
        </div>
      )
    );
  }
}

export default EditMarketer;
