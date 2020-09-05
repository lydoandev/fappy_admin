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
import Toast from "../../../common/Toast";

const fields = ['name', 'phone', 'location', 'image', 'actions']

class ListRestaurants extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listRestaurant: [],
      totalRecordsRes: 0,
      row: 10,
      content: "",
      searchInput: "",
      dataFilter: []
    }
  }
  componentDidMount() {
    fire.database().ref('restaurants').on('value', snapshot => {
      const restaurantObject = snapshot.val();
      const restaurantList = Object.keys(restaurantObject).map(key => ({
        ...restaurantObject[key],
        uid: key,
      }));

      this.setState({
        listRestaurant: restaurantList,
        totalRecordsRes: restaurantList.length,
        dataFilter: restaurantList
      });
    });
  }

  handleEdit = (rowData, url) => {
    this.props.history.push(`${routesUrl[url]}/${rowData.uid}`);
  }

  handleDelete = (rowData, nameCollection) => {
    let itemRef = fire.database().ref(`${nameCollection}/${rowData.uid}`)
    itemRef.remove()
      .then(() => {
        this.setState({ content: `This ${nameCollection} deleted sucess` })
      })
      .catch((error) => {
        this.setState({ content: `This ${nameCollection} not exist!` });
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
    const { totalRecordsRes, dataFilter, content, searchInput, row } = this.state

    return (
      <>
        {content && <Toast content={content} />}
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
                          <button onClick={() => this.handleEdit(item, "NEW_RESTAURANTS")} className="btn btn-outline-info btn-sm"><i className="fas fa-marker"></i></button>
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
