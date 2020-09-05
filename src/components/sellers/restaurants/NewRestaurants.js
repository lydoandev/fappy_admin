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
  openHour: "",
  closeHour: "",
  image: "",
  location: {
    address: ""
  },
  name: "",
  phone: "",
  starRating: 1,
};

class NewRestaurants extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: { ...INITAL_STATE },
      imageAsFile: "",
      content: "",
      errors: {
        openHour: false,
        closeHour: false,
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
    let { restaurants, errors } = this.state;
    let stateValue = event.target.value;
    let stateName = event.target.name;
    restaurants[stateName] = stateValue
    errors[stateName] = false;
    if (stateName === "phone") {
      errors[stateName] = validateError.getInputError(stateValue, stateName)
    }
    this.setState({ restaurants, errors });
  };

  handleChangeAddress = (event) => {
    let { errors } = this.state
    let stateValue = event.target.value;
    errors["address"] = false
    this.setState(prevState => ({
      restaurants: {
        ...prevState.restaurants,
        location: {
          ...prevState.restaurants.location,
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
    let { imageAsFile, restaurants, errors } = this.state;

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
            restaurants["image"] = fireBaseUrl
            errors["image"] = false
            this.setState(prevObject => ({ ...prevObject, restaurants, errors }))
          })

      })
  }

  handleSave = () => {
    let isValid = true;
    let { restaurants, errors } = this.state;

    Object.keys(restaurants).forEach((key) => {
      if (restaurants[key] === "") {
        errors[key] = true;
      } else if (restaurants["location"]['address'] === "") {
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
      this.addRestaurants(this.state.restaurants);
    } else {
      this.setState({ content: "This Restaurants has data incorrect!" });
    }
  };

  addRestaurants = (restaurants) => {
    const ref = firebase.database().ref("restaurants/");
    ref.push(restaurants)

      .then(() => {
        window.location.href = routesUrl.LIST_RESTAURANT;
        this.setState({ content: "This restaurants add sucess" });
      })
      .catch((error) => {
        this.setState({ content: "Update restaurants incorrect" });
      });
  };

  handleClose = () => {
    this.props.history.push(routesUrl.LIST_RESTAURANT);
  };

  handleButton = () => {
    this.inputRef.click();
  }

  render() {
    const { restaurants, errors, content } = this.state;
    const invalidValue = [undefined, null];

    return (
      restaurants && (
        <>
          {content && <Toast content={content} />}
          <CRow className="justify-content-center">
            <CCol xs="12" md="6">
              <CCard>
                <CCardHeader>
                  Add Restaurants
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
                          placeholder="Enter restaurant name"
                          value={invalidValue.includes(restaurants.name) ? "" : restaurants.name}
                          onChange={this.handleChange}
                        />
                        {errors.name && <CFormText className="text-danger">Please enter your restaurant name</CFormText>}
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
                          value={restaurants.phone}
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
                        <CLabel className="font-weight-bold">Open</CLabel>
                      </CCol>
                      <CCol xs="12" md="3">
                        <CInput
                          type="time"
                          name="openHour"
                          placeholder="time"
                          value={restaurants.openHour}
                          onChange={this.handleChange}
                        />
                        {errors.openHour && <CFormText className="text-danger">Please enter time</CFormText>}
                      </CCol>
                      <CCol md="2" className="text-right">
                        <CLabel className="font-weight-bold">Close</CLabel>
                      </CCol>
                      <CCol xs="12" md="4">
                        <CInput
                          type="time"
                          name="closeHour"
                          placeholder="time"
                          value={restaurants.closeHour}
                          onChange={this.handleChange}
                        />
                        {errors.closeHour && <CFormText className="text-danger">Please enter time</CFormText>}
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
                          value={restaurants.starRating}
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
                        <CImg className="image border border-primary rounded mr-3" src={restaurants.image === "" ? 'avatars/no-image.jpg' : restaurants.image} />
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
                          value={invalidValue.includes(restaurants.location.address) ? "" : restaurants.location.address}
                          onChange={this.handleChangeAddress}
                        />
                        {errors.address && <CFormText className="text-danger">Please enter address</CFormText>}
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

export default NewRestaurants;
