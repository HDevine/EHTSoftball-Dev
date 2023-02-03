import React from 'react';
import {
  Alert,
  AlertGroup,
  AlertVariant,
  AlertActionCloseButton,
} from '@patternfly/react-core';

class SoftballAlerts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alerts: []    
    };
  };

  render() {
    const addAlerts = (incomingAlerts) => {
      this.setState({ alerts: [...this.state.alerts, ...incomingAlerts] });
    };
    const getUniqueId = () =>(
      (String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now())
    );
    const addSuccessAlert = (title) => {
      addAlerts([{ title: title, variant: 'success', key: getUniqueId() }])
    };
    const addFailureAlert = (title) => {
      addAlerts([{ title: title, variant: 'danger', key: getUniqueId() }])
    };
    this.removeAlert = key => {
      this.setState({ alerts: [...this.state.alerts.filter(el => el.key !== key)] });
    };

    return (
      <React.Fragment>
        <AlertGroup isToast isLiveRegion>
          {this.state.alerts.map(({ title, variant, key, action }) => (
            <Alert
              isInline
              variant={AlertVariant[variant]}
              title={title}
              key={key}
              timeout={5000}
              actionClose={
                <AlertActionCloseButton
                  title={title}
                  variantLabel={`${variant} alert`}
                  onClose={() => this.removeAlert(key)}
                />
              }/>
          ))}
        </AlertGroup>
      </React.Fragment>
    );
  }
}

export default SoftballAlerts;

