import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CCallout
} from '@coreui/react'

import fire from "../.././config/fire";
class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listMarketer: [],
      listOrder: [],
      listRestaurant: [],
      listUser: []
    };
  }
  componentDidMount() {
    fire.database().ref('orders').on('value', snapshot => {
      const orderObject = snapshot.val();

      const orderList = Object.keys(orderObject).map(key => ({
        ...orderObject[key],
        uid: key,
      }));

      this.setState({
        listOrder: orderList
      });
    });

    fire.database().ref('marketers').on('value', snapshot => {
      const marketerObject = snapshot.val();
      const marketerList = Object.keys(marketerObject).map(key => ({
        ...marketerObject[key],
        uid: key,
      }));

      this.setState({
        listMarketer: marketerList,
      });
    });

    fire.database().ref('restaurants').on('value', snapshot => {
      const restaurantObject = snapshot.val();
      const restaurantList = Object.keys(restaurantObject).map(key => ({
        ...restaurantObject[key],
        uid: key,
      }));

      this.setState({
        listRestaurant: restaurantList,
      });
    });

    fire.database().ref('users').on('value', snapshot => {
      const userObject = snapshot.val();
      const userList = Object.keys(userObject).map(key => ({
        ...userObject[key],
        uid: key,
      }));

      this.setState({
        listUser: userList,
      });
    });
  }
  render() {
    const { listMarketer, listRestaurant, listOrder, listUser } = this.state
    return (
      <>
        <div className="wellcome-page">
          <div className="title"><h2>WELLCOME TO FADDY ADMIN PAGE</h2></div>
        </div>
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                Faddy Management
            </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol xs="12" md="6" xl="6">

                    <CRow>
                      <CCol sm="6">
                        <CCallout color="info">
                          <small className="text-muted">Users</small>
                          <br />
                          <strong className="h4">{listUser.length}</strong>
                        </CCallout>
                      </CCol>
                      <CCol sm="6">
                        <CCallout color="danger">
                          <small className="text-muted">Orders</small>
                          <br />
                          <strong className="h4">{listOrder.length}</strong>
                        </CCallout>
                      </CCol>
                    </CRow>

                    <hr className="mt-0" />

                  </CCol>

                  <CCol xs="12" md="6" xl="6">

                    <CRow>
                      <CCol sm="6">
                        <CCallout color="warning">
                          <small className="text-muted">Maketers</small>
                          <br />
                          <strong className="h4">{listMarketer.length}</strong>
                        </CCallout>
                      </CCol>
                      <CCol sm="6">
                        <CCallout color="success">
                          <small className="text-muted">Restaurants</small>
                          <br />
                          <strong className="h4">{listRestaurant.length}</strong>
                        </CCallout>
                      </CCol>
                    </CRow>
                    <hr className="mt-0" />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}
export default Dashboard
