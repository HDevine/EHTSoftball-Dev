import React from 'react';
import {
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  Button,
  Form,
  FormGroup,
  Popover,
  Radio,
  Select,
  SelectDirection,
  SelectOption,
  SelectVariant,
  TextInput,
  Modal,
  ModalVariant
} from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';

class AdminCoachModal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      isOpen: false,
      name: "",
      phone: "",
      email: "",
      alerts: []
    };

    this.addAlert = (title, variant, key) => {
      this.setState({
        alerts: [ ...this.state.alerts, {title: title, variant: variant, key }]
      });
    };

    this.removeAlert = key => {
      this.setState({ alerts: [...this.state.alerts.filter(el => el.key !== key)]});
    };

    this.getUniqueId = () => (new Date().getTime());

    this.addSuccessAlert = () => { 
      this.addAlert('Coach Added successfully', 'success', this.getUniqueId());
    };
      
    this.addFailureAlert = () => { 
      this.addAlert('Coach Added unsuccessfully', 'danger', this.getUniqueId()) 
    };
   
    this.handleModalToggle = () => {
      this.setState(({ isModalOpen}) => ({
        isModalOpen: !isModalOpen
      }));
    };

    this.handleCoachAdd = () => {
      this.setState(({ isModalOpen}) => ({
          isModalOpen: !isModalOpen
        }));
      let data = Array(this.state.name, this.state.phone, this.state.email);
      /* Add Coach to database...*/
      updateDatabase('http://softball-pi4/db/AddCoach.php', { data })      
        .then(data => {
        if (data.message === "Coach created successfully") {
          this.props.setCoachAdded(true);
          this.addSuccessAlert();
        }
        else {
          this.props.setCoachAdded(false);
          this.addFailureAlert();
        }
      });
    
      /* Reset dialog fields for next time */
      this.setState({ name: "" });
      this.setState({ phone: "" });
      this.setState({ email: "" });
    };

    this.handleCoachCancel = () => {
      this.setState(({ isModalOpen}) => ({
          isModalOpen: !isModalOpen
        }));
      
      /* Reset dialog fields for next time */
      this.setState({ name: "" });
      this.setState({ phone: "" });
      this.setState({ email: "" });
    };

    async function updateDatabase (url = '', data = {}) {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response.json();
    };
  
    this.onNameChange = newValue => {
        this.setState(({ name: newValue }));
    };
    this.onPhoneChange = newValue => {
        this.setState(({ phone: newValue }));
    };
    this.onEmailChange = newValue => {
        this.setState(({ email: newValue }));
    };
    this.onEscapePress = () => {
      this.setState(({ isOpen }) => ({
        isOpen: !isOpen
      }));
    };
    this.onToggle = isOpen => {
      this.setState({ isOpen });
    };
    
  }

  render() {
    const { isModalOpen, isOpen, name, phone, email } = this.state;
    
    return (
      <React.Fragment>
        <AlertGroup isToast isLiveRegion>
          {this.state.alerts.map(({key, variant, title}) => (
            <Alert
              variant={AlertVariant[variant]}
              title={title}
              timeout={5000}
              actionClose={
                <AlertActionCloseButton
                  title={title}
                  variantLabel={`variant} alert`}
                  onClose={() => this.removeAlert(key)}
                />
              }
              key={key} />
          ))}
        </AlertGroup>
        <Button variant="primary" onClick={this.handleModalToggle}>Add New Coach</Button>{'  '}
        <Modal
          variant={ModalVariant.medium}
          title="Add New Coach"
          id="add-new-coach-modal"
          description="Adds a new coach to the EHT Softball League"
          isOpen={isModalOpen}
          onClose={this.handleCoachCancel}
          actions={[
            <Button key="addCoach" variant="primary" form="add-coach-form" onClick={this.handleCoachAdd}>
              Add Coach
            </Button>,
            <Button key="cancelAddCoach" variant="link" onClick={this.handleCoachCancel}>
              Cancel
            </Button>
          ]}
          onEscapePress={this.onEscapePress}
        >
        <Form id="add-coach-form">
          <FormGroup
            label="Name"
              labelIcon={
              <Popover
                headerContent={
                 <div>The name of the Coach</div>
                }
                bodyContent={
                  <div>Enter the coach's name</div>
                }   
              > 
              <button
                type="button"
                aria-label="More info for Name field"
                onClick={e => e.preventDefault()}
                aria-describedby="add-coach-modal-name"
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign />
              </button>
              </Popover>
              }
              isRequired
              fieldId="add-coach-modal-name">
              <TextInput
                isRequired
                type="text"
                id="add-coach-name"
                name="add-coach-name"
                value={this.name}
                onChange={this.onNameChange}
              />
          </FormGroup>
          <FormGroup
            label="Phone Number"
            labelIcon={
            <Popover
              headerContent={
                <div>The coach's phone number</div>
              }
              bodyContent={
                <div>Phone number in the form (xxx)yyy-zzzz</div>
              }
            >
            <button
              type="button"
              aria-label="More info for phone number field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-coach-phone-number"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-coach-phone-number">
            <TextInput
              isRequired
              type="text"
              id="modal-with-form-phone"
              name="modal-with-form-phone"
              value={this.phone}
              onChange={this.onPhoneChange}
            />
          </FormGroup>
          <FormGroup
            label="Email Address"
            labelIcon={
            <Popover
               headerContent={
                 <div>The coach's email address</div>
               }
               bodyContent={
                 <div>Enter the coach's email address</div>
               }
            >
            <button
              type="button"
              aria-label="More info for the Email Address field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-coach-email"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-coach-email">
            <TextInput
              isRequired
              type="text"
              id="modal-with-form-email"
              name="modal-with-form-email"
              value={this.email}
              onChange={this.onEmailChange}
            />
          </FormGroup>
        </Form>
        </Modal>
      </React.Fragment>
    )
  }
}

export default AdminCoachModal;
