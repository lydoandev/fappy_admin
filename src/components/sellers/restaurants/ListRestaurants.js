import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CFormGroup,
  CLabel,
  CInput,
  CSelect
} from '@coreui/react'

import fire from "../../../config/fire";
import * as routesUrl from '../../../routesUrl'
import { ToastContainer, toast } from 'react-toastify';

const fields = ['name', 'phone', 'location', 'image', 'actions']

class ListRestaurants extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listRestaurant: [],
      totalRecordsRes: 0,
      row: 10,
      searchInput: "",
      dataFilter: []
    }
  }
  componentDidMount() {
    this.getListRestaurants()
  }

  getListRestaurants = () => {
    fire.database().ref('restaurants').on('value', snapshot => {
      const restaurantObject = snapshot.val();
      const restaurantList = Object.keys(restaurantObject).map(key => ({
        ...restaurantObject[key],
        uid: key,
      }));

      let  listRestaurants = restaurantList.filter(item => item.deletedAt !== true)

      this.setState({
        listRestaurant: listRestaurants,
        totalRecordsRes: listRestaurants.length,
        dataFilter: listRestaurants
      });
    });
  }

  handleEdit = (rowData) => {
    this.props.history.push(`${routesUrl.EDIT_RESTAURANTS}/${rowData.uid}`);
  }

  handleDelete = (rowData, nameCollection) => {
    let data = rowData
    data.deletedAt = true
    let itemRef = fire.database().ref(`${nameCollection}/${rowData.uid}`)
    itemRef.update(data)
      .then(() => {
        toast.success(`This ${nameCollection} deleted success`)
      })
      .catch((error) => {
        toast.error(`This ${nameCollection} not exist!`);
      })
  }

  handleAdd = (nameRouter) => {
    this.props.history.push(routesUrl[nameRouter]);
  }

  handleSelected = (event) => {
    this.setState({ row: parseInt(event.target.value) })
  }

  handleChange = (event) => {
    let stateValue = event.target.value
    this.setState({ searchInput: stateValue })
    const timer = setTimeout(() => {
      this.globalSearch()
    }, 1000);
    return () => clearTimeout(timer);
  }

  globalSearch = () => {
    let { searchInput, listRestaurant, dataFilter } = this.state;

    dataFilter = listRestaurant.filter(item => {
      return (
        (item.name && item.name.toLowerCase().includes(searchInput.toLowerCase())) ||
        (item.phone && item.phone.toLowerCase().includes(searchInput.toLowerCase()))
      )
    })

    let data = searchInput ? dataFilter : listRestaurant
    this.setState({ dataFilter: data, totalRecordsRes: data.length })

  }

  render() {
    const { totalRecordsRes, dataFilter, searchInput, row } = this.state

    return (
      <>
      <ToastContainer/>
        <CRow >
          <CCol>
            <CCard>
              <CCardHeader>
                <h5 className="mr-3 d-inline">List Restaurants ({totalRecordsRes})</h5>
                <button onClick={() => this.handleAdd("NEW_RESTAURANTS")} className="btn btn-outline-success btn-sm"><i className="fas fa-plus"></i></button>
              </CCardHeader>
              <div className="row px-3 pt-4">
                <CFormGroup className="col-6 d-flex align-items-center">
                  <CLabel>Filter</CLabel>
                  <CInput
                    className="w-auto ml-3"
                    value={searchInput}
                    onChange={this.handleChange}
                  />
                </CFormGroup>
                <CFormGroup className="col-3 offset-3 d-flex align-items-center justify-content-end">
                  <CLabel>Rows</CLabel>
                  <CSelect className="w-auto ml-3" value={row} onChange={this.handleSelected}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </CSelect>
                </CFormGroup>
              </div>
              <CCardBody>
                <CDataTable
                  items={dataFilter}
                  fields={fields}
                  hover
                  striped
                  bordered
                  size="sm"
                  itemsPerPage={row}
                  pagination
                  scopedSlots={{
                    'image':
                      (item) => (
                        <td>
                          <img src={item.image} className="image" alt="" />
                        </td>
                      ),
                    'location':
                      (item) => (
                        <td>
                          {item.location.address}
                        </td>
                      )
                    , 'actions':
                      (item) => (
                        <td>
                          <button onClick={() => this.handleEdit(item, "_RESTAURANTS")} className="btn btn-outline-info btn-sm"><i className="fas fa-marker"></i></button>
                          <button onClick={() => this.handleDelete(item, "restaurants")} className="btn btn-outline-danger btn-sm ml-3"><i className="fas fa-times"></i></button>
                        </td>
                      )

                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default ListRestaurants
