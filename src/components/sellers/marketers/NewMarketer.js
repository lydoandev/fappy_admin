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
  CImg,
  CTextarea
} from "@coreui/react";
import * as routesUrl from "../../../routesUrl";
import firebase from "../../../config/fire";
import validateError from "../../../common/validateError";
import ValidateInput from "../../../common/validateInput"
import Toast from "../../../common/Toast";

const INITAL_STATE = {
  image: "",
  location: {
    address: ""
  },
  name: "",
  phone: "",
  starRating: 1,
};

class NewMarketer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      marketers: { ...INITAL_STATE },
      imageAsFile: "",
      content: "",
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
    errors["address"] = false
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
    this.uploadImage(e)
  }

  uploadImage = (e) => {
    let { imageAsFile, marketers, errors } = this.state;
    // e.preventDefault()

    const storage = firebase.storage()
    if (imageAsFile === '') {
      this.setState({ content: `Not an image, the image file is a ${typeof (imageAsFile)}` })
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
    console.log(marketers)
    Object.keys(errors).forEach(
      (key) => errors[key] === true && (isValid = false)
    );

    if (isValid) {
      this.addMarketers(this.state.marketers);
    } else {
      this.setState({ content: "This marketers has data incorrect!" });
    }
  };

  addMarketers = (marketers) => {
    const ref = firebase.database().ref("marketers/");
    ref.push(marketers)
      .then(() => {
        window.location.href = routesUrl.LIST_MARKETER;
        this.setState({ content: "This marketers add success" });
      })
      .catch((error) => {
        this.setState({ content: "Update marketers incorrect" });
      });
  };

  handleClose = () => {
    this.props.history.push(routesUrl.LIST_MARKETER);
  };

  handleButton = () => {
    this.inputRef.click();
  }

  render() {
    const { marketers, errors, content } = this.state;
    const invalidValue = [undefined, null];

    return (
      marketers && (
        <>
          {content && <Toast content={content} />}
          <CRow className="justify-content-center">
            <CCol xs="12" md="6">
              <CCard>
                <CCardHeader>
                  Add marketers
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
                      <CCol xs="12" md="4">
                        <CImg className="image border border-primary rounded mr-3" src={marketers.image === "" ? 'avatars/no-image.jpg' : marketers.image} />
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
                    SAVE
                </CButton>

                  <CButton
                    className="font-weight-bold"
                    size="sm"
                    color="danger"
                    onClick={this.handleClose}>
                    CANCEL
                </CButton>
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>
        </>
      )
    );
  }
}

export default NewMarketer;
