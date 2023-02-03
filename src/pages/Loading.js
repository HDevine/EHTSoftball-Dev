import { React } from "react";
import {
  Bullseye,
  Spinner
} from '@patternfly/react-core';

export const Loading: React.FC = () => {
//  const loadingImg = "https://cdn.auth0.com/blog/hello-auth0/loader.svg";

  return (
    <div className="loader">
	    <Bullseye>
	      <Spinner size="xl" />
      </Bullseye>
    </div>
  );
};
