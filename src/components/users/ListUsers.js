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
  CSelect,
  CInput
} from '@coreui/react'

import fire from "../../config/fire";
import * as routesUrl from '../../routesUrl'

const fields = ['firstName', 'lastName', 'fullName', 'phone', 'role', 'status', 'actions']

class ListUsers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listUsers: [],
      totalRecords: 0,
      row: 10,
      searchInput: "",
      dataFilter: []
    }
  }
  componentDidMount() {
    fire.database().ref('users').on('value', snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        totalRecords: usersList.length,
        listUsers: usersList,
        dataFilter: usersList
      });
    });
  }

  handleEdit = (rowData) => {
    this.props.history.push(`${routesUrl.USER_UPDATE}/${rowData.uid}`);
  }

  handleAdd = () => {
    this.props.history.push(routesUrl.USER_ADD);
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
    let { searchInput, listUsers, dataFilter } = this.state;

    dataFilter = listUsers.filter(item => {
      return (
        (item.firstName && item.firstName.toLowerCase().includes(searchInput.toLowerCase())) ||
        (item.lastName && item.lastName.toLowerCase().includes(searchInput.toLowerCase())) ||
        (item.fullName && item.fullName.toLowerCase().includes(searchInput.toLowerCase())) ||
        (item.phone && item.phone.toLowerCase().includes(searchInput.toLowerCase())) ||
        (item.role && item.role.toLowerCase().includes(searchInput.toLowerCase())) ||
        (item.status && item.status.toLowerCase().includes(searchInput.toLowerCase()))
      )
    })

    let data = searchInput ? dataFilter : listUsers
    this.setState({ dataFilter: data, totalRecords: data.length })

  }

  render() {
    const { dataFilter, totalRecords, row, searchInput } = this.state
    return (
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                <h5 className="mr-3 d-inline">List User ({totalRecords})</h5>
                <button onClick={this.handleAdd} className="btn-add-user btn btn-outline-success btn-sm"><i className="fas fa-user-plus"></i></button>
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
                    'actions':
                      (item) => (
                        <td style={{ width: '100px' }}>
                          <button onClick={() => this.handleEdit(item)} className="btn btn-outline-info btn-sm"><i className="fas fa-user-edit"></i></button>
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

export default ListUsers
