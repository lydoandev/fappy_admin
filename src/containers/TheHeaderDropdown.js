import React from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import fire from "../config/fire";

const TheHeaderDropdown = () => {

  const handleLogout = (event) => {
    event.preventDefault();
    fire.auth().signOut()
      .then(() => {
        localStorage.removeItem("login_status");
        window.location.href = '/'
      })
      .catch((error) => {
        console.log("error: ", error)
      })
  }

  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={'/logo-faddy.ico'}
            className="c-avatar-img"
            alt="Faddy logo"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem
          header
          tag="div"
          color="light"
          className="text-center"
        >
          <strong>Account</strong>
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem onClick={handleLogout}>
          <span className="fas fa-sign-out-alt mr-2"> </span>
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
