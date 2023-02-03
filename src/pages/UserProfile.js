import React from "react";
import brandImg from '../tornados.png';
import softballbg from '../softball_background.png';
import {
  AboutModal
} from '@patternfly/react-core';

import { useAuth0 } from "@auth0/auth0-react";

const UserProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isModalOpen, setModalOpen] = React.useState(false);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  const handleModalToggle = (event) => {
    event.preventDefault();
    setModalOpen(!isModalOpen);
  }
  
  return (
    isAuthenticated && (
      <div>
	    <AboutModal
	      isOpen={isModalOpen}
	      onClose={handleModalToggle}
	      trademark="Copyright &copy; 2022 Egg Harbor Township Softball"
          brandImageSrc={brandImg}
	      brandImageAlt="EHT Softball Logo"
	      backgroundImageSrc={softballbg}
	      productName="EHT Softball"
	    >
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </AboutModal>
      </div>
    )
  );
};

export default UserProfile;