import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow
} from '@coreui/react'
import fire from "../../config/fire";

const fields = ['firstName','lastName', 'fullName', 'phone', 'role', 'sellerId']

class Tables extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listUsers: null
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
        listUsers: usersList,
      });
    });
  }

  
  render() {
    const { listUsers } = this.state

    return (
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                List User
              </CCardHeader>
              <CCardBody>
              <CDataTable
                items={listUsers}
                fields={fields}
                hover
                striped
                bordered
                size="sm"
                itemsPerPage={10}
                pagination
                // scopedSlots = {{
                //   'status':
                //     (item)=>(
                //       <td>
                //         <CBadge color={getBadge(item.status)}>
                //           {item.status}
                //         </CBadge>
                //       </td>
                //     )
                // }}
              />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default Tables
