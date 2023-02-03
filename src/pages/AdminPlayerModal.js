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

class AdminPlayerModal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      isOpen: false,
      playerRec: true,
      playerTravel: false,
      name: "",
      jersey: "",
      division: "",
      playerType: "rec",
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
      this.addAlert('Player Added successfully', 'success', this.getUniqueId());
    };
      
    this.addFailureAlert = () => { 
      this.addAlert('Player Added unsuccessfully', 'danger', this.getUniqueId()) 
    };

    this.divisionDropdownItems = [
      <SelectOption key={0} value="Select a Division" isPlaceholder />,
      <SelectOption key={1} value="6U" />,
      <SelectOption key={2} value="8U" />,
      <SelectOption key={3} value="10U" />,
      <SelectOption key={4} value="12U" />,
      <SelectOption key={5} value="14U" />,
      <SelectOption key={6} value="16U" />,
      <SelectOption key={7} value="18U" />
    ];
      
    this.handleModalToggle = () => {
      this.setState(({ isModalOpen}) => ({
        isModalOpen: !isModalOpen
      }));
    };

    this.handlePlayerAdd = () => {
      this.setState(({ isModalOpen}) => ({
          isModalOpen: !isModalOpen
        }));
        /* Add Board Member to database...*/
        let data = Array(this.state.name, this.state.jersey,this.state.division, this.state.playerType, 0)  
        updateDatabase('http://softball-pi4/db/AddPlayer.php', { data })
      .then(data => {
        if (data.message === "Player created successfully") {
          this.props.setPlayerAdded(true);
          this.addSuccessAlert();
        }
        else {
          this.props.setPlayerAdded(false);
          this.addFailureAlert();
        }
      });
    
      /* Reset dialog fields for next time */
      this.setState({ name: "" });
      this.setState({ jersey: "" });
      this.setState({ division: "" });
      this.setState({ playerType: "rec" });
    };

    this.handlePlayerCancel = () => {
      this.setState(({ isModalOpen}) => ({
          isModalOpen: !isModalOpen
        }));
      
      /* Reset dialog fields for next time */
      this.setState({ name: "" });
      this.setState({ jersey: "" });
      this.setState({ division: "" });
      this.setState({ playerType: "rec" });
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
    this.onJerseyChange = newValue => {
        this.setState(({ jersey: newValue }));
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
          this.setState({ division: ""});
          this.setState({ isOpen: false })
      }
      else {
        this.setState({ division: selection});
        this.setState({ isOpen: false })
      }
    };
            
    this.onPlayerRecChange = (_, event) => {
      this.setState({ playerTravel: false });
      this.setState({ playerRec: true });
      this.setState({ playerType: "rec" });
    };
    this.onPlayerTravelChange = (_, event) => {
      this.setState({ playerTravel: true });
      this.setState({ playerRec: false });
      this.setState({ playerType: "travel" });
    };

  }

  render() {
    const { isModalOpen, isOpen, name, jersey, division, playerRec, playerTravel, playerType } = this.state;
    
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
        <Button variant="primary" onClick={this.handleModalToggle}>Add New Player</Button>{'  '}
        <Modal
          variant={ModalVariant.medium}
          title="Add New Player"
          description="Adds a new player to the EHT Softball League"
          isOpen={isModalOpen}
          onClose={this.handlePlayerCancel}
          actions={[
            <Button key="addPlayer" variant="primary" form="add-player-form" onClick={this.handlePlayerAdd}>
              Add Player
            </Button>,
            <Button key="cancelAddPlayer" variant="link" onClick={this.handlePlayerCancel}>
              Cancel
            </Button>
          ]}
          onEscapePress={this.onEscapePress}
        >
        <Form id="add-player-form">
          <FormGroup
            label="Name"
              labelIcon={
              <Popover
                headerContent={
                 <div>The name of the Player</div>
                }
                bodyContent={
                  <div>Enter as follows (for privacy): &lt;First Name&gt;&lt;space&gt;&lt;Last Name&gt;space</div>
                }   
              > 
              <button
                type="button"
                aria-label="More info for Name field"
                onClick={e => e.preventDefault()}
                aria-describedby="add-player-modal-name"
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign />
              </button>
              </Popover>
              }
              isRequired
              fieldId="add-player-modal-name">
              <TextInput
                isRequired
                type="text"
                id="add-player-name"
                name="add-player-name"
                value={this.name}
                onChange={this.onNameChange}
              />
          </FormGroup>
          <FormGroup
            label="Jersey Number"
            labelIcon={
            <Popover
              headerContent={
                <div>The player's jersey number</div>
              }
              bodyContent={
                <div>Usually a number between 0 - 99.</div>
              }
            >
            <button
              type="button"
              aria-label="More info for jersey number field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-player-jersey-number"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-player-jersey-number">
            <TextInput
              isRequired
              type="text"
              id="modal-with-form-jersey"
              name="modal-with-form-jersey"
              value={this.jersey}
              onChange={this.onJerseyChange}
            />
          </FormGroup>
          <FormGroup
            label="Division"
            labelIcon={
            <Popover
               headerContent={
                 <div>What division will this player compete in?</div>
               }
               bodyContent={
                 <div>Choose either 6U, 8U, 10U, 12U, 14U, 16U, or 18U(Travel).</div>
               }
            >
            <button
              type="button"
              aria-label="More info for the Division field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-player-division"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-player-division">
            <Select
              variant={SelectVariant.single}
              aria-label="Select Division"
              onToggle={this.onToggle}
              onSelect={this.onSelect}
              selections={division}
              isOpen={isOpen}
              aria-labelledby="select-player-division-id"
              direction={SelectDirection.down}
              menuAppendTo={() => document.body}
              maxHeight="200px"
            >
                { this.divisionDropdownItems }
            </Select>
          </FormGroup>
          <FormGroup
            label="Player Type"
            labelIcon={
            <Popover
               headerContent={
                 <div>Is this player a Rec player or a Travel player?</div>
               }
               bodyContent={
                 <div>Select a player type (Rec is the default player type)</div>
               }
            >
            <button
              type="button"
              aria-label="More info for the player type field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-player-type"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-player-type">
              <Radio
                isChecked={this.state.playerRec}
                id="playerType"
                name="playerType"
                onChange={this.onPlayerRecChange}
                label="Rec Player"
                value="rec"
              >
              </Radio>
              <Radio
                isChecked={this.state.playerTravel}
                id="playerType"
                name="playerType"
                onChange={this.onPlayerTravelChange}
                label="Travel Player"
                value="travel"
              >
              </Radio>
          </FormGroup>
        </Form>
        </Modal>
      </React.Fragment>
    )
  }
}

export default AdminPlayerModal;
