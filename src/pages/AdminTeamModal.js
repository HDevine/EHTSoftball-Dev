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

class AdminTeamModal extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        isModalOpen: false,
        isDivisionOpen: false,
        isColorOpen: false,
        team: "",
        teamColor: "",
        teamRec: true,
        teamTravel: false,
        teamType: "rec",
        division: "",
        url: "http://softball-pi4/db/AddRecTeam.php",
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
  
    this.addSuccessAlert = (string) => { 
      this.addAlert(string, 'success', this.getUniqueId());
    };
        
    this.addFailureAlert = (string) => { 
      this.addAlert(string, 'danger', this.getUniqueId()) 
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

    this.teamColorItems = [
      <SelectOption key={0} value="Select a Team Color" isPlaceholder />,
      <SelectOption key={1} value="Pink" />,
      <SelectOption key={2} value="Yellow" />,
      <SelectOption key={3} value="Teal" />,
      <SelectOption key={4} value="Purple" />,
      <SelectOption key={5} value="Green" />,
      <SelectOption key={6} value="Blue" />,
      <SelectOption key={7} value="Light Blue" />,
      <SelectOption key={8} value="Red" />,
      <SelectOption key={9} value="Orange" />,
      <SelectOption key={10} value="White" />
    ];
      
    this.handleModalToggle = () => {
      this.setState(({ isModalOpen}) => ({
        isModalOpen: !isModalOpen
      }));
    };

    this.handleTeamAdd = () => {
      this.setState(({ isModalOpen}) => ({
        isModalOpen: !isModalOpen
      }));
      /* Add Team to database...*/
      let data = Array(this.state.team, this.state.division, this.state.teamColor);
      updateDatabase(this.state.url, { data })
      .then(data => {
        if ((data.message === "Rec Team created successfully") || (data.message === "Travel Team created successfully")) {
          this.props.setTeamAdded(true);
          this.addSuccessAlert(data.message);
        }
        else {
          this.props.setTeamAdded(false);
          this.addFailureAlert(data.message);
          console.log(this.state.team, this.state.division, this.state.teamColor);
        }
      });
    
      /* Reset dialog fields for next time */
      this.setState({ team: "" });
      this.setState({ teamColor: "" });
      this.setState({ teamType: "rec" });
      this.setState({ division: "" });
      this.setState({ url: "http://softball-pi4/db/AddRecTeam.php" });
    };

    this.handleTeamCancel = () => {
      this.setState(({ isModalOpen}) => ({
        isModalOpen: !isModalOpen
      }));
      
      /* Reset dialog fields for next time */
      this.setState({ team: "" });
      this.setState({ teamColor: "" });
      this.setState({ teamType: "rec" });
      this.setState({ division: "" });
      this.setState({ url: "http://softball-pi4/db/AddRecTeam.php" });
    };

    async function updateDatabase (url = '', data = {}) {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response.json();
    };

    this.onTeamChange = newValue => {
      this.setState(({ team: newValue }));
    };
    this.onEscapePress = () => {
      this.setState(({ isDivisionOpen }) => ({
        isDivisionOpen: !isDivisionOpen
      }));
      this.setState(({ isColorOpen }) => ({
        isColorOpen: !isColorOpen
      }));
    };
    this.onDivisionToggle = isDivisionOpen => {
      this.setState({ isDivisionOpen });
    };
    this.onColorToggle = isColorOpen => {
      this.setState({ isColorOpen });
    };
        
    this.onDivisionSelect = (event, selection, isPlaceholder) => {
        if (isPlaceholder) {
          this.setState({ division: ""});
          this.setState({ isDivisionOpen: false })
      }
      else {
        this.setState({ division: selection});
        this.setState({ isOpen: false })
      }
    };
    this.onColorSelect = (event, selection, isPlaceholder) => {
      if (isPlaceholder) {
        this.setState({ teamColor: ""});
        this.setState({ isColorOpen: false })
      }
      else {
        this.setState({ teamColor: selection});
        this.setState({ isColorOpen: false })
      }
    };
    this.onTeamRecChange = (_, event) => {
      this.setState({ teamTravel: false });
      this.setState({ teamRec: true });
      this.setState({ teamType: "rec" })
      this.setState({ url: "http://softball-pi4/db/AddRecTeam.php" });
    };
    this.onTeamTravelChange = (_, event) => {
      this.setState({ teamTravel: true });
      this.setState({ teamRec: false });
      this.setState({ teamType: "travel" }); 
      this.setState({ url: "http://softball-pi4/db/AddTravelTeam.php" });
    };
          
  }

  render() {
    const { isModalOpen, isDivisionOpen, isColorOpen, team, teamColor, teamRec, teamTravel, teamType, coachname, coachphone, coachemail, division, url } = this.state;
    
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
        <Button variant="primary" onClick={this.handleModalToggle}>Add New Team</Button>{'  '}
        <Modal
          variant={ModalVariant.medium}
          id="add-new-team-modal"
          title="Add New Team"
          description="Adds a new team to the EHT Softball League"
          isOpen={isModalOpen}
          onClose={this.handleTeamCancel}
          actions={[
            <Button key="addTeam" variant="primary" form="add-team-form" onClick={this.handleTeamAdd}>
              Add Team
            </Button>,
            <Button key="cancelAddTeam" variant="link" onClick={this.handleTeamCancel}>
              Cancel
            </Button>
          ]}
          onEscapePress={this.onEscapePress}
        >
        <Form id="add-team-form">
          <FormGroup
            label="Team Name"
              labelIcon={
              <Popover
                headerContent={
                 <div>The name of the team</div>
                }
                bodyContent={
                  <div>Enter Team Name</div>
                }   
              > 
              <button
                type="button"
                aria-label="More info for Team Name field"
                onClick={e => e.preventDefault()}
                aria-describedby="add-team-modal-team"
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign />
              </button>
              </Popover>
              }
              isRequired
              fieldId="add-team-modal-team">
              <TextInput
                isRequired
                type="text"
                id="add-team-name"
                name="add-team-name"
                value={this.team}
                onChange={this.onTeamChange}
              />
          </FormGroup>
          <FormGroup
            label="Team Color"
            labelIcon={
            <Popover
               headerContent={
                 <div>What color will this team use?</div>
               }
               bodyContent={
                 <div>Select a color from the list</div>
               }
            >
            <button
              type="button"
              aria-label="More info for the color field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-player-color"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-team-color">
            <Select
              variant={SelectVariant.single}
              aria-label="Select Team Color"
              onToggle={this.onColorToggle}
              onSelect={this.onColorSelect}
              selections={teamColor}
              isOpen={isColorOpen}
              aria-labelledby="select-team-color-id"
              direction={SelectDirection.down}
              menuAppendTo={() => document.body}
              maxHeight="200px"
            >
                { this.teamColorItems }
            </Select>
          </FormGroup>
          <FormGroup
            label="Team Type"
            labelIcon={
            <Popover
               headerContent={
                 <div>Is this team a Rec team or a Travel team?</div>
               }
               bodyContent={
                 <div>Select a team type (Rec is the default team type)</div>
               }
            >
            <button
              type="button"
              aria-label="More info for the team type field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-team-type"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-team-type">
              <Radio
                isChecked={this.state.teamRec}
                id="teamType"
                name="teamType"
                onChange={this.onTeamRecChange}
                label="Rec Team"
                value="rec"
              >
              </Radio>
              <Radio
                isChecked={this.state.teamTravel}
                id="teamType"
                name="teamType"
                onChange={this.onTeamTravelChange}
                label="Travel Team"
                value="travel"
              >
              </Radio>
          </FormGroup>
          <FormGroup
            label="Division"
            labelIcon={
            <Popover
               headerContent={
                 <div>What division will this team compete in?</div>
               }
               bodyContent={
                 <div>Choose either 6U, 8U, 10U, 12U, 14U, 16U, or 18U (18U is for Travel Team only).</div>
               }
            >
            <button
              type="button"
              aria-label="More info for the Division field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-team-division"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-team-division">
            <Select
              variant={SelectVariant.single}
              aria-label="Select Division"
              onToggle={this.onDivisionToggle}
              onSelect={this.onDivisionSelect}
              selections={division}
              isOpen={isDivisionOpen}
              aria-labelledby="select-team-division-id"
              direction={SelectDirection.down}
              menuAppendTo={() => document.body}
              maxHeight="200px"
            >
                { this.divisionDropdownItems }
            </Select>
          </FormGroup>
        </Form>
        </Modal>
      </React.Fragment>
    )
  }
}

export default AdminTeamModal;
