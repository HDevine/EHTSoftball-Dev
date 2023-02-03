import React, { useEffect } from 'react';
import {
  AboutModal,
  Avatar,
  Brand,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownToggle,
  Masthead,
  MastheadBrand,
  MastheadMain,
  MastheadToggle,
  MastheadContent,
  PageToggleButton,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import brandImg from '../tornados.png';
import softballbg from '../softball_background.png';
import { Link } from 'react-router-dom';
import BarsIcon from '@patternfly/react-icons/dist/js/icons/bars-icon';
import Image from "../tornados.png";
import avatarImg from '@patternfly/react-core/src/components/Avatar/examples/avatarImg.svg';
import { useAuth0 } from '@auth0/auth0-react';

const SoftballMasthead = ({ children }) => {
//  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [isAuthenticated, setAuthenticated] = React.useState(true);
  const [isDropdownOpen, setDropdownOpen] = React.useState(false);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const strYear = new Date().getFullYear();

  const onLoginClick = () => {
//    console.log("Reimplement loginWithRedirect")
//    loginWithRedirect();
  }

  const onLogoutClick = () => {
//    console.log("Reimplement logout")
//    logout({
//      returnTo: window.location.origin,
//    });
  }

  const nonAdminDropdownItems = [
    <DropdownGroup key="nonAdminGroup">
      <DropdownItem key="nonAdminGroup-Login">Admin Login</DropdownItem>
    </DropdownGroup>
  ];

  const adminDropdownItems = [
    <DropdownGroup key="adminGroup">
      <DropdownItem key="adminGroup-Profile">My Profile</DropdownItem>
      <DropdownItem key="adminGroup-Logout">Logout</DropdownItem>
    </DropdownGroup>
  ];

  const onDropdownToggle = isDropdownOpen => {
    setDropdownOpen (isDropdownOpen);
  };

  const handleModalToggle = (event) => {
    event.preventDefault();
    setModalOpen(!isModalOpen);
  }

  const onDropdownSelect = event => {
    setDropdownOpen(!isDropdownOpen);
    if (event.target.innerText === "Admin Login") {
      onLoginClick();
    }
    if (event.target.innerText === "My Profile") {
      console.log(strYear);
      setModalOpen(!isModalOpen);
    }
    if (event.target.innerText === "Logout") {
      onLogoutClick();
    }
  };

  const headerToolbar = (
    <Toolbar id="toolbar" isFullHeight isStatic>
      <ToolbarContent>
        <ToolbarGroup
          variant="icon-button-group"
          alignment={{ default: 'alignRight' }}
          spacer={{ default: 'spacerNone', md: 'spacerMd' }}>
          <ToolbarItem>
          {isAuthenticated && (
            <Dropdown
              position="right"
              onSelect={onDropdownSelect}
              isOpen={isDropdownOpen}
              toggle={
                <DropdownToggle icon={<Avatar /*src={user.picture}*/ alt="Avatar" /> } onToggle={onDropdownToggle}>
                   Harry Devine
                </DropdownToggle>
              }
              dropdownItems={adminDropdownItems}
            />
            )}
            {!isAuthenticated && (
            <Dropdown
              position="right"
              onSelect={onDropdownSelect}
              isOpen={isDropdownOpen}
              toggle={
                <DropdownToggle onToggle={onDropdownToggle}>
                  Not Logged In
                </DropdownToggle>
              }
              dropdownItems={nonAdminDropdownItems}
            />
            )}
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );

  return (
    <Masthead id="ehtys" backgroundColor="dark">
      <MastheadToggle>
        <PageToggleButton variant="plain" aria-label="Global Navigation">
          <BarsIcon />
         <Link to="/"></Link>
        </PageToggleButton>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand>
          <Brand src={Image} alt="EHTYS Logo" width="50" height="50" />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
      {isAuthenticated && (
        <AboutModal
          isOpen={ isModalOpen }
          onClose={handleModalToggle}
          trademark={`Copyright © ${strYear} Egg Harbor Township Softball`}
          brandImageSrc={brandImg}
          brandImageAlt="EHT Softball Logo"
          backgroundImageSrc={softballbg}
          productName="EHT Softball - User Profile"
        >
            <h2>Harry Devine</h2>
            <p>lifter89@comcast.net</p>
        </AboutModal>
        )}
        Egg Harbor Township Youth Softball {headerToolbar}
      </MastheadContent>
    </Masthead>
  );
}

export default SoftballMasthead;
