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
  Select,
  SelectDirection,
  SelectOption,
  SelectVariant,
  TextInput,
  Modal,
  ModalVariant
} from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';

class AdminFieldsModal extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        isModalOpen: false,
        isOpen: false,
        fieldNum: "",
        fieldReason: "",
        fieldStatus: "Closed",
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
        this.addAlert('Field Added successfully', 'success', this.getUniqueId());
      };
      
      this.addFailureAlert = () => { 
        this.addAlert('Field NOT Added successfully', 'danger', this.getUniqueId()) 
      };

      this.statusDropdownItems = [
        <SelectOption key={0} value="Select a Status" isPlaceholder />,
        <SelectOption key={1} value="Open" />,
        <SelectOption key={2} value="Closed" />
      ];
      
      this.handleModalToggle = () => {
        this.setState(({ isModalOpen}) => ({
          isModalOpen: !isModalOpen
        }));
      };

    this.handleFieldAdd = () => {
      this.setState(({ isModalOpen}) => ({
          isModalOpen: !isModalOpen
      }));
      /* Add Field to database...*/
      let data = Array(this.state.fieldNum, this.state.fieldStatus, this.state.fieldReason);
      updateDatabase('http://softball-pi4/db/AddField.php', { data })
      .then(data => {
        if (data.message === "Error in creating field") {
          this.addFailureAlert();
        }
        else {
          this.props.setFieldAdded(true);
          this.addSuccessAlert();
        }
      });
    
      /* Reset dialog fields for next time */
      this.setState({ fieldNum: "" });
      this.setState({ fieldStatus: "Closed" });
      this.setState({ fieldReason: "" });
    };

    this.handleFieldCancel = () => {
      this.setState(({ isModalOpen}) => ({
          isModalOpen: !isModalOpen
        }));
      
      /* Reset dialog fields for next time */
      this.setState({ fieldNum: "" });
      this.setState({ fieldStatus: "Closed" });
      this.setState({ fieldReason: "" });
    };

    this.onFieldNumChange = newValue => {
      this.setState(({ fieldNum: newValue }));
    };

    this.onFieldReasonChange = newValue => {
      this.setState(({ fieldReason: newValue }));
    };

    this.onEscapePress = () => {
      this.setState(({ isOpen }) => ({
        isOpen: !isOpen
      }));
    };

    this.onToggle = isOpen => {
      this.setState({ isOpen });
    };
    
    this.onSelect = (event, selection, isPlaceholder) => {
      if (isPlaceholder) {
        this.setState({ fieldStatus: "Closed"});
        this.setState({ isOpen: false })
      }
      else {
        this.setState({ fieldStatus: selection});
        this.setState({ isOpen: false })
      }
    };

    async function updateDatabase (url = '', data = {}) {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response.json();
    };
            
  }

  render() {
    const { isModalOpen, isOpen, fieldNum, fieldStatus, fieldReason, alerts } = this.state;
    
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
        <Button variant="primary" onClick={this.handleModalToggle}>Add New Field</Button>{'  '}
        <Modal
          variant={ModalVariant.medium}
          title="Add New Field"
          id="add-new-field-modal"
          description="Adds a new field to the EHT Softball League"
          isOpen={isModalOpen}
          onClose={this.handleFieldCancel}
          actions={[
            <Button key="addField" variant="primary" form="add-field-form" onClick={this.handleFieldAdd}>
              Add Field
            </Button>,
             <Button key="cancelAddField" variant="link" onClick={this.handleFieldCancel}>
              Cancel
            </Button>
          ]}
          onEscapePress={this.onEscapePress}
        >
        <Form id="add-field-form">
          <FormGroup
            label="Field Number"
              labelIcon={
              <Popover
                headerContent={
                 <div>The number of the field</div>
                }
                bodyContent={
                  <div>EHT Field Number (1 - 7)</div>
                }   
              > 
              <button
                type="button"
                aria-label="More info for Field Number field"
                onClick={e => e.preventDefault()}
                aria-describedby="add-field-modal-number"
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign />
              </button>
              </Popover>
              }
              isRequired
              fieldId="add-field-modal-number">
              <TextInput
                isRequired
                type="text"
                id="add-field-number"
                name="add-field-number"
                value={this.fieldNum}
                onChange={this.onFieldNumChange}
              />
          </FormGroup>
          <FormGroup
            label="Field Status"
            labelIcon={
            <Popover
               headerContent={
                 <div>Current status of this field</div>
               }
               bodyContent={
                 <div>Choose either Open or Closed.</div>
               }
            >
            <button
              type="button"
              aria-label="More info for the Field Status field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-field-status"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-field-status">
            <Select
              variant={SelectVariant.single}
              aria-label="Select Field Status"
              onToggle={this.onToggle}
              onSelect={this.onSelect}
              selections={fieldStatus}
              isOpen={isOpen}
              aria-labelledby="select-field-status"
              direction={SelectDirection.down}
              menuAppendTo={() => document.body}
              maxHeight="200px"
            >
                { this.statusDropdownItems }
            </Select>
          </FormGroup>
          <FormGroup
            label="Field Reason"
            labelIcon={
            <Popover
              headerContent={
                <div>Reason for current field status</div>
              }
              bodyContent={
                <div>Practice, Maintenance, etc.</div>
              }
            >
            <button
              type="button"
              aria-label="More info for field reason field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-field-reason"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-field-reason">
            <TextInput
              isRequired
              type="text"
              id="modal-with-form-field-reason"
              name="modal-with-form-field-reason"
              value={this.fieldReason}
              onChange={this.onFieldReasonChange}
            />
          </FormGroup>
        </Form>
        </Modal>
      </React.Fragment>
    )
  }
}

export default AdminFieldsModal;
