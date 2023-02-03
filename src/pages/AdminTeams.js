import React, { useEffect } from 'react';
import {
  Alert, 
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  Bullseye,
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  CardTitle,
  DragDrop,
  Draggable,
  Droppable,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DualListSelector,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateBody,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Label,
  List,
  ListItem,
  Modal,
  ModalVariant,
  PageSection,
  PageSectionVariants,
  Popover,
  Radio,
  Select,
  SelectDirection,
  SelectOption,
  SelectVariant,
  Spinner,
  Split,
  SplitItem,
  Tabs,
  Tab,
  TabContent,
  TabTitleText,
  Text,
  Title,
  Tooltip
} from '@patternfly/react-core';
import "@patternfly/react-core/dist/styles/base.css";
import AdminTeamModal from './AdminTeamModal';
import PlayerTeamEditTableRow from './PlayerTeamEditTableRow';
import CoachTeamEditTableRow from './CoachTeamEditTableRow';
import ConfirmDialog from './ConfirmDialog';
import { Thead, TableComposable, TableVariant, Tr, Th, Tbody, Td} from '@patternfly/react-table';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import PlusCircleIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import MinusCircleIcon from '@patternfly/react-icons/dist/js/icons/minus-circle-icon';
import PficonSortCommonAscIcon from "@patternfly/react-icons/dist/esm/icons/pficon-sort-common-asc-icon";
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';

export const columnNames = {
  playerName: 'Name',
  playerNumber: 'Jersey Number'
};
export const coachColumnNames = {
  coachName: 'Name',
  coachPhone: 'Phone Number',
  coachEmail: 'Email Address',
  coachTitle: 'Title'
};

//class AdminTeams extends React.Component {
const AdminTeams = ({ children, ...props }) => {
  const { fetchPlayers, playerData, setPlayerData, playerLoading, setPlayerLoading, playerErr, setPlayerErr,
          fetchCoach, coachData, setCoachData, coachLoading, setCoachLoading, coachErr, setCoachErr } = props;
  const [teamData, setTeamData] = React.useState(null);
  const [teamLoading, setTeamLoading] = React.useState(true);
  const [teamErr, setTeamErr] = React.useState(false);
  const [travelData, setTravelData] = React.useState(null);
  const [travelLoading, setTravelLoading] = React.useState(true);
  const [travelErr, setTravelErr] = React.useState(false);
  const [activeTabKey, setActiveTabKey] = React.useState(0);
  const [teamAdded, setTeamAdded] = React.useState(false);
  const [alerts, setAlerts] = React.useState([]);
  const [isAddPlayerDlgOpen, setAddPlayerDlgOpen] = React.useState(false);
  const [isAddCoachDlgOpen, setAddCoachDlgOpen] = React.useState(false);
  const [teamId, setTeamId] = React.useState(0);
  const [teamName, setTeamName] = React.useState("");
  const [teamType, setTeamType] = React.useState("");
  const [division, setDivision] = React.useState("");
  const [isHeadCoachChecked, setHeadCoachChecked] = React.useState(true);
  const [isAssistant1Checked, setAssistant1Checked] = React.useState(false);
  const [isAssistant2Checked, setAssistant2Checked] = React.useState(false);
  const [availablePlayers, setAvailablePlayers] = React.useState([]);
  const [chosenPlayers, setChosenPlayers] = React.useState([]);
  const [availableCoach, setAvailableCoach] = React.useState([]);
  const [destHeadCoach, setDestHeadCoach] = React.useState([]);
  const [destAssistantCoach1, setDestAssistantCoach1] = React.useState([]);
  const [destAssistantCoach2, setDestAssistantCoach2] = React.useState([]);
  const [activeSortIndex, setActiveSortIndex] = React.useState(0); 
  const [activeSortDirection, setActiveSortDirection] = React.useState('asc');
  const [activeCoachSortIndex, setActiveCoachSortIndex] = React.useState(0); 
  const [activeCoachSortDirection, setActiveCoachSortDirection] = React.useState('asc');
  const [availablePlayersState, setAvailablePlayersState] = React.useState([]);
  const [chosenPlayersState, setChosenPlayersState] = React.useState([]);
  const [isConfirmDlgOpen, setConfirmDlgOpen] = React.useState(false);
  const [isCoachSelectOpen, setCoachOpen] = React.useState(false);
  const [coachSelected, setCoachSelected] = React.useState(null);
  const [coachSelections, setCoachSelections] = React.useState([]);
  const [coachName, setCoachName] = React.useState("");
  const getSortablePlayerRowValues = players => {
    const {playerName, playerNumber} = players;
    return [playerName, playerNumber];
  };
  const getSortableCoachRowValues = coach => {
    const {name, phone, email, title} = coach;
    return [name, phone, email, title];
  };

  const availablePlayersActions = [
    <Button
      variant={ButtonVariant.plain}
      onClick={() => onSort("available")}
      aria-label="Sort"
      key="availableSortButton"
    >
      <PficonSortCommonAscIcon />
    </Button>,
  ];

  const chosenPlayersActions = [
    <Button
      variant={ButtonVariant.plain}
      onClick={() => onSort("chosen")}
      aria-label="Sort"
      key="chosenSortButton"
    >
      <PficonSortCommonAscIcon />
    </Button>,
  ];

  const handleAddPlayerToTeam = (id, level, name, type) => {
    let playersArray = Array();
    let teamArray = Array();
    let filteredArray = Array();
    setTeamId(id);
    setTeamName(name);
    setDivision(level);
    setAddPlayerDlgOpen(true);

    playerData.filter(function (data) {
      return ((data.division === level) && (data.type === type)) ;
    }).map((filteredPlayer => ( 
      playersArray.push(<span id={filteredPlayer.id}>{filteredPlayer.playerName}</span>)
    )));

    playerData.filter(function (data) {
      return data.teamId === id;
    }).map((teamPlayer => (
      teamArray.push(<span id={teamPlayer.id}>{teamPlayer.playerName}</span>)
    )));
    
    let onTeam = false;
    playersArray.forEach((player) => {
      teamArray.forEach((team) => {
        if (player.props.id === team.props.id){
          onTeam = true;
        }
      });
      if (!onTeam) {
        filteredArray.push(player);
      }
      onTeam = false;
    });
    setAvailablePlayers(filteredArray);
    setAvailablePlayersState(filteredArray);
  }

  const handleAddCoachToTeam = (id, level, name) => {
    setTeamId(id);
    setTeamName(name);
    setDivision(level);
    setAddCoachDlgOpen(true);
    setHeadCoachChecked(true);
    setAssistant1Checked(false);
    setAssistant2Checked(false);
  }

  const handleRemoveTeam = (id, name) => {
    setTeamId(id);
    setTeamName(name);
    setConfirmDlgOpen(true);
  }

  const handleAddModalOK = () => {
    setAddPlayerDlgOpen(false);

    for (let i=0; i < chosenPlayers.length; i++) {
      addPlayer(chosenPlayers[i].props.id, teamId, chosenPlayers[i].props.children, teamName);
    }
    // Clear chosen players list for next time
    setChosenPlayers([]);
  }

  const handleAddModalCancel = () => {
    setAddPlayerDlgOpen(false);
  }

  const handleAddCoachModalOK = () => {
    setAddCoachDlgOpen(false);
    let field = "";
    if (isHeadCoachChecked)
      field = "headcoach";
    if (isAssistant1Checked)
      field = "assistantcoach1";
    if (isAssistant2Checked)
      field = "assistantcoach2";
    addCoach(coachSelected, teamId, field);
    setCoachSelected(null);
  }

  const handleAddCoachModalCancel = () => {
    setAddCoachDlgOpen(false);
    setCoachSelected(null);
  }

  async function updateDatabase (url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  };

  const addPlayer = (id, teamId, name, teamName) => {
    let data = Array(id, teamId);
    updateDatabase('http://softball-pi4/db/AddPlayerToTeam.php', { data })      
    .then(data => {
      if (data.message === "Player/Team assignment updated successfully") {
        addSuccessAlert(name + " added to " + teamName + " successfully");
        fetchPlayers();
      }
      else {
        addFailureAlert(name + " unsuccessfully added to " + teamName);
        fetchPlayers();
        console.log("Error adding " + name + " to " + teamName);
      }
    });
  }

  const addCoach = (id, teamId, field) => {
    let data = Array(id, teamId, field);
    updateDatabase('http://softball-pi4/db/AddCoachToTeam.php', { data })      
    .then(data => {
      if (data.message === "Coach added to team successfully") {
        addSuccessAlert(coachName + " added to " + teamName + " successfully");
        fetchPlayers();
      }
      else {
        addFailureAlert(coachName + " unsuccessfully added to " + teamName);
        fetchPlayers();
        console.log("Error adding Coach to " + teamName);
      }
    });
  }

  const removeFromTeam = async (id, playerName, team) => {
    let playerId = Array(id);
      updateDatabase('http://softball-pi4/db/DeletePlayerFromTeam.php', { playerId })
      .then(data => {
        if (data.message === "Player/Team assignment reset successfully") {
          addSuccessAlert(playerName + " removed from " + team + " successfully");
          fetchPlayers();
        }
        else {
          addFailureAlert(playerName + " removal unsuccessful");
          fetchPlayers();
          console.log("Error removing " + playerName + "from " + team);
        }
      });
  }

  const removeTeam = async (id, name) => {
    let delID = Array(id);
    updateDatabase("http://softball-pi4/db/DeleteTeam.php", { delID })
    .then(data => {
      if ((data.message === "Error in deleting Team")) {
        addFailureAlert(teamName + " removal unsuccessful");
        fetchRecTeams();
        fetchTravelTeams();
        console.log("Error removing " + teamName);
      }
      else {
        addSuccessAlert(teamName + " removed successfully");
        fetchRecTeams();
        fetchTravelTeams();
      }
    });
  }

  const handleYes = () => {
    setConfirmDlgOpen(false);

    // Reset all players on this team (essentially removing them from the team
    playerData.filter(function (data) {
      return data.teamId === teamId;
    }).map((teamPlayer => (
      removeFromTeam(teamPlayer.id, teamPlayer.playerName, teamName)
    )));

    // Remove the selected team
    removeTeam(teamId, teamName);
  }

  const handleNo = () => {
    setConfirmDlgOpen(false);
  }

  const handleTabClick = (_, tabIndex) => setActiveTabKey(tabIndex);
    
  const addAlert = (title, variant, key) => {
    setAlerts([ ...alerts, {title: title, variant: variant, key }]);
  };

  const removeAlert = key => {
    setAlerts([...alerts.filter(el => el.key !== key)]);
  };

  const getUniqueId = () => (new Date().getTime());

  const addSuccessAlert = ( string ) => { 
    addAlert(string, 'success', getUniqueId());
  };
      
  const addFailureAlert = ( string ) => { 
    addAlert(string, 'danger', getUniqueId()) 
  };

  if (playerData?.length > 0) {
    let sortedPlayers = playerData;
    if (sortedPlayers !== null) {
      sortedPlayers = playerData.sort((a, b) => {
        const aValue = getSortablePlayerRowValues(a)[activeSortIndex];
        const bValue = getSortablePlayerRowValues(b)[activeSortIndex];
        if ((aValue === null) || (bValue === null)) {
          return 0;
        }
        if (typeof aValue === 'number') {
          if (activeSortDirection === 'asc') {
            return aValue - bValue;
          }
          return bValue - aValue;
        } else {
          if (activeSortDirection === 'asc') {
            return aValue.localeCompare(bValue);
          }
          return bValue.localeCompare(aValue);
        }
      });
    }
  }

  if (coachData?.length > 0) {
    let sortedCoach = coachData;
    if (sortedCoach !== null) {
      sortedCoach = coachData.sort((a, b) => {
        const aValue = getSortableCoachRowValues(a)[activeCoachSortIndex];
        const bValue = getSortableCoachRowValues(b)[activeCoachSortIndex];
        if ((aValue === null) || (bValue === null) ) {
          return 0;
        }
        if (typeof aValue === 'number') {
          if (activeCoachSortDirection === 'asc') {
            return aValue - bValue;
          }
          return bValue - aValue;
        } else {
          if (activeCoachSortDirection === 'asc') {
            return aValue.localeCompare(bValue);
          }
          return bValue.localeCompare(aValue);
        }
      });
    }
  }

  const getSortParams = columnIndex => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection
    },
    onSort: (_event, index, direction) => {
      console.log(index, direction, columnIndex);
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex
  });

  const getCoachSortParams = columnIndex => ({
    sortBy: {
      index: activeCoachSortIndex,
      direction: activeCoachSortDirection
    },
    onSort: (_event, index, direction) => {
      console.log(index, direction, columnIndex);
      setActiveCoachSortIndex(index);
      setActiveCoachSortDirection(direction);
    },
    columnIndex
  });

  useEffect(() => {
    fetchRecTeams();
    fetchTravelTeams();
    fetchPlayers();
  }, [teamAdded]);

/*  useEffect(() => {
    fetchRecTeams();
    fetchTravelTeams();
    fetchPlayers();
    fetchCoach();
    // Set up the Available Coaches selection array
    let coachesArray = Array();
    coachesArray.push(<SelectOption key={0} value="Select a coach" isPlaceholder />);
    if (coachData?.length > 0) {
      coachData.map((coach) => {
        coachesArray.push(<SelectOption key={coach.id} value={coach.id}>{coach.name}</SelectOption>);
      });
    }
    setCoachSelections(coachesArray); 
  }, [coachData]);
*/
  const fetchRecTeams = () => {
    // Fetch data for Rec Teams
    fetch(`http://softball-pi4/db/GetRecTeams.php`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setTeamData(jsonResponse);
      setTeamLoading(false);
    })
    .catch(err => {
      setTeamErr(err);
      setTeamLoading(false);
    })
  }

  const fetchTravelTeams = () => {
    // Fetch data for Travel Teams
    fetch(`http://softball-pi4/db/GetTravelTeams.php`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setTravelData(jsonResponse);
      setTravelLoading(false);
    })
    .catch(err => {
      setTravelErr(err);
      setTravelLoading(false);
    })
  }

  const onSort = (panel) => {
    if (panel === "available") {
      setAvailablePlayersState((prevAvailablePlayersState) => {
        const available = prevAvailablePlayersState.sort((a, b) => {
          let returnValue = 0;
          if (a.props.children > b.props.children) returnValue = 1;
          if (a.props.children < b.props.children) returnValue = -1;
          return returnValue;
        });
        return {
          availableOptions: available
        };
      });
    }

    if (panel === "chosen") {
      setChosenPlayersState((prevChosenPlayersState) => {
        const chosen = prevChosenPlayersState.sort((a, b) => {
          let returnValue = 0;
          if (a.props.children > b.props.children) returnValue = 1;
          if (a.props.children < b.props.children) returnValue = -1;
          return returnValue;
        });
        return {
          chosenOptions: chosen
        };
      });
    }
  };

  const onListChange = (newAvailablePlayers, newChosenPlayers) => {
    setAvailablePlayers( newAvailablePlayers.sort() );
    setAvailablePlayersState( newAvailablePlayers.sort() );
    setChosenPlayers( newChosenPlayers.sort() );
    setChosenPlayersState( newChosenPlayers.sort() );
  };

  const move = (source, destination, type, sourceIndex, destIndex) => {
    const sourceClone = source;
    const destClone = destination;
    const [removed] = sourceClone.splice(sourceIndex, 1);
    destClone.splice(destIndex, 0, removed);
    switch (type){
      case "headcoach":
        setDestHeadCoach(destClone);
        break;
      case "assistant1":
        setDestAssistantCoach1(destClone);
        break;
      case "assistant2":
        setDestAssistantCoach2(destClone);
        break;
    }
    return [sourceClone, destClone];
};

  const onDrop = (source, dest) => {
    if (dest) {
      switch(dest.droppableId){
        case '0':
          break;
        case '1':
          if (destHeadCoach.length === 0){
            move(availableCoach, destHeadCoach, "headcoach", source.index, dest.index);
            return true;
          }
          else {
            return false;
          }
          break;
        case '2':
          if (destAssistantCoach1.length === 0){
            move(availableCoach, destAssistantCoach1, "assistant1", source.index, dest.index);
            return true;
          }
          else {
            return false;
          }
          break;
        case '3':
          if (destAssistantCoach2.length === 0){
            move(availableCoach, destAssistantCoach2, "assistant2", source.index, dest.index);
            return true;
          }
          else {
            return false;
          }
          break;
      }
      return true;
    } else {
      return false;
    }
    
  }

  const onHeadCoachChange = (_, event) => {
    setHeadCoachChecked(true);
    setAssistant1Checked(false);
    setAssistant2Checked(false);
  };
  const onAssistant1Change = (_, event) => {
    setHeadCoachChecked(false);
    setAssistant1Checked(true);
    setAssistant2Checked(false);
  };
  const onAssistant2Change = (_, event) => {
    setHeadCoachChecked(false);
    setAssistant1Checked(false);
    setAssistant2Checked(true);
  };

  const onCoachToggle = isCoachSelectOpen => {
    setCoachOpen(isCoachSelectOpen);
  };

  const onCoachSelect = (event, selection, isPlaceholder) => {
    if (isPlaceholder){
      setCoachSelected(null);
      setCoachOpen(false);
      setCoachName("");
    }
    setCoachOpen(false);
    setCoachSelected(selection);
    setCoachName(event.target.innerText);
  };

  return (
    <div>
      <PageSection variant={PageSectionVariants.light} key="adminTeamsSection1">
      <ConfirmDialog title={"Are you sure you want to remove " + teamName + "?"} isModalOpen={isConfirmDlgOpen} handleYes={handleYes} handleNo={handleNo}/>
      <AlertGroup isToast isLiveRegion>
      {alerts.map(({ key, variant, title }) => (
        <Alert
          variant={AlertVariant[variant]}
          title={title}
          timeout={5000}
          actionClose={<AlertActionCloseButton
            title={title}
            variantLabel={`variant} alert`}
            onClose={() => removeAlert(key)} />} 
          key={key} />
      ))}
      </AlertGroup>
      <Modal
        variant={ModalVariant.medium}
        title="Add Player To Team"
        id="add-player-to-team-modal"
        description={"Add a player to " + teamName + " - " + division}
        isOpen={isAddPlayerDlgOpen}
        onClose={handleAddModalCancel}
        actions={[
          <Button key="addTeam" variant="primary" form="add-team-form" onClick={handleAddModalOK}>
            Add Player(s)
          </Button>,
          <Button key="cancelAddTeam" variant="link" onClick={handleAddModalCancel}>
            Cancel
          </Button>
        ]}
      > 
        <DualListSelector
          availableOptionsTitle="Available Players"
          availableOptions={availablePlayers}
          availableOptionsActions={availablePlayersActions}
          chosenOptionsTitle={`Team: ${teamName} - Division: ${division}`}
          chosenOptions={chosenPlayers}
          chosenOptionsActions={chosenPlayersActions}
          addAll={onListChange}
          removeAll={onListChange}
          addSelected={onListChange}
          removeSelected={onListChange}
          onListChange={onListChange}
          id="playerTeamSelector"
        />
      </Modal>
      <Modal
        variant={ModalVariant.medium}
        title="Add Coach To Team"
        description={"Adds a coach to " + teamName + " - " + division}
        isOpen={isAddCoachDlgOpen}
        onClose={handleAddCoachModalCancel}
        actions={[
          <Button key="addCoach" variant="primary" form="add-coach-team-form" onClick={handleAddCoachModalOK}>
            Add Coach
          </Button>,
          <Button key="cancelAddCoach" variant="link" onClick={handleAddCoachModalCancel}>
            Cancel
          </Button>
        ]}
      >
        <Form id="add-team-form">
          <FormGroup
            label="Coach Type"
            labelIcon={
            <Popover
               headerContent={
                 <div>Is this Coach the Head Coach, Assistant Coach 1, or Assistant Coach 2?</div>
               }
               bodyContent={
                 <div>Select a coach type (Head Coach is the default Coach type)</div>
               }
            >
            <button
              type="button"
              aria-label="More info for the coach type field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-coach-type"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-coach-type">
              <Radio
                isChecked={isHeadCoachChecked}
                id="coachType"
                name="coachType"
                onChange={onHeadCoachChange}
                label="Head Coach"
                value="headcoach"
              >
              </Radio>
              <Radio
                isChecked={isAssistant1Checked}
                id="coachType"
                name="coachType"
                onChange={onAssistant1Change}
                label="Assistant Coach 1"
                value="assistant1"
              >
              </Radio>
              <Radio
                isChecked={isAssistant2Checked}
                id="coachType"
                name="coachType"
                onChange={onAssistant2Change}
                label="Assistant Coach 2"
                value="assistant2"
              >
              </Radio>
          </FormGroup>
          <FormGroup
            label="Available Coaches"
            labelIcon={
            <Popover
               headerContent={
                 <div>Available Coaches</div>
               }
               bodyContent={
                 <div>Select a coach</div>
               }
            >
            <button
              type="button"
              aria-label="More info for the select coach field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-coach-select"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-coach-select">
            <Select
              variant={SelectVariant.single}
              aria-label="Select Coach"
              onToggle={onCoachToggle}
              onSelect={onCoachSelect}
              selections={coachSelected}
              isOpen={isCoachSelectOpen}
              direction={SelectDirection.down}
              menuAppendTo={() => document.body}
              maxHeight="200px"
            >
              {coachSelections}
            </Select>
          </FormGroup>
        </Form>
      </Modal>

      <AdminTeamModal setTeamAdded={setTeamAdded} addSuccessAlert={addSuccessAlert} addFailureAlert={addFailureAlert}  />
      </PageSection>
      <PageSection type="adminTeamTabs" isWidthLimited key="adminTeamsSection2">
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} usePageInsets id="adminTeamDivisionsTab">
          <Tab eventKey={0} title={<TabTitleText>6U</TabTitleText>} tabContentId={`tabContent${0}`} />
          <Tab eventKey={1} title={<TabTitleText>8U</TabTitleText>} tabContentId={`tabContent${1}`} />
          <Tab eventKey={2} title={<TabTitleText>10U</TabTitleText>} tabContentId={`tabContent${2}`} />
          <Tab eventKey={3} title={<TabTitleText>12U</TabTitleText>} tabContentId={`tabContent${3}`} />
          <Tab eventKey={4} title={<TabTitleText>14U</TabTitleText>} tabContentId={`tabContent${4}`} />
          <Tab eventKey={5} title={<TabTitleText>16U</TabTitleText>} tabContentId={`tabContent${5}`} />
          <Tab eventKey={6} title={<TabTitleText>Travel</TabTitleText>} tabContentId={`tabContent${6}`} />
        </Tabs>
      </PageSection>
      <PageSection isWidthLimited key="adminTeamsSection3">
     <TabContent key={0} eventKey={0} id={`tabContent${0}`} activeKey={activeTabKey} hidden={0 !== activeTabKey}>
        {teamLoading && (
          <Bullseye>
            <Spinner size="xl" />
          </Bullseye>
        )}
        {!teamLoading && teamData?.length === 0 && (
          <Bullseye>
            <EmptyState variant={EmptyStateVariant.small}>
              <EmptyStateIcon icon={SearchIcon} />
                <Title headingLevel="h2" size="lg">
                  No Team information retrieved!
                </Title>
              <EmptyStateBody>
                Check your network connection or contact the system administrator.
              </EmptyStateBody>
            </EmptyState>
          </Bullseye>
        )}
          <React.Fragment key="6u_teams">
          {!teamLoading && teamData
            .filter(function (data) {
              return data.division === "6U";
            })
            .map((row => (
              <Card key={row.id} isSelectable>
              <CardHeader>
                <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>{'  '}
                <Text component="br" />
                <Button key="addPlayer" variant="link" form="add-player-form" onClick={() => handleAddPlayerToTeam(row.id, "6U", row.teamName, row.type)}>
                  Add Player to Team
                </Button>{'    '}
                <Button key="addCoach" variant="link" form="add-coach-form" onClick={() => handleAddCoachToTeam(row.id, "6U", row.teamName)}>
                  Add Coach to Team
                </Button>{'    '}
                <Button key="removeTeam" variant="link" form="remove-team-form" onClick={() => handleRemoveTeam(row.id, row.teamName)}>
                  Remove this Team
                </Button>{'    '}
              </CardHeader>
              <CardBody>
                <Title headingLevel="h2" size="lg">Coaching Staff</Title>
                <TableComposable variant={TableVariant.default} aria-label="coach+{row.teamName}+table">
                    <Thead>
                      <Tr>
                        <Th sort={getCoachSortParams(0)}>{coachColumnNames.coachName}</Th>
                        <Th sort={getCoachSortParams(1)}>{coachColumnNames.coachPhone}</Th>
                        <Th sort={getCoachSortParams(2)}>{coachColumnNames.coachEmail}</Th>
                        <Th>{coachColumnNames.coachTitle}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {!coachLoading && coachData
                      .filter(function (data) {
                        return ( (data.id === row.headcoach) ||
                                 (data.id === row.assistantcoach1) ||
                                 (data.id === row.assistantcoach2) );
                      })
                      .map((coach => (
                        <CoachTeamEditTableRow
                          key={"CoachForTeam_"+coach.id}
                          currentRow={coach}
                          division="6U"
                          teamName={row.teamName}
                          teamId={row.id}
                          headcoach={row.headcoach}
                          assistant1={row.assistantcoach1}
                          assistant2={row.assistantcoach2}
                          fetchCoach={fetchCoach}
                          addSuccessAlert={addSuccessAlert} 
                          addFailureAlert={addFailureAlert}
                        />
                      )))}
                    </Tbody>
                  </TableComposable>
                <Text component="br" />
                <Text component="br" />
                <Title headingLevel="h2" size="lg">Roster</Title>
                <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
                  <Thead>
                    <Tr>
                      <Th sort={getSortParams(0)}>{columnNames.playerName}</Th>
                      <Th sort={getSortParams(1)}>{columnNames.playerNumber}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                  {!playerLoading && playerData
                  .filter(function (data) {
                    return data.teamId === row.id;
                  })
                  .map((player => (
                    <PlayerTeamEditTableRow
                      key={"PlayerOnTeam_"+player.id}
                      currentRow={player}
                      division="6U"
                      teamName={row.teamName}
                      fetchPlayers={fetchPlayers}
                      addSuccessAlert={addSuccessAlert} 
                      addFailureAlert={addFailureAlert}
                    />
                  )))}
                  </Tbody>
                </TableComposable>
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
          )))}
            </React.Fragment>
          </TabContent>
        <TabContent key={1} eventKey={1} id={`tabContent${1}`} activeKey={activeTabKey} hidden={1 !== activeTabKey}>
          {teamLoading && (
            <Bullseye>
              <Spinner size="xl" />
            </Bullseye> 
          )}
          {!teamLoading && teamData?.length === 0 && (
            <Bullseye>
              <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateIcon icon={SearchIcon} />
                  <Title headingLevel="h2" size="lg">
                    No Team information retrieved!
                  </Title>
                <EmptyStateBody>
                  Check your network connection or contact the system administrator.
                </EmptyStateBody>
              </EmptyState>
            </Bullseye>
          )}
         <React.Fragment key="8u_teams">
           {!teamLoading && teamData
            .filter(function (data) {
              return data.division === "8U";
            })
            .map((row => (
              <Card key={row.id} isSelectable>
              <CardHeader>
                <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>{'  '}
                <Text component="br" />
                <Button key="addPlayer" variant="link" form="add-player-form" onClick={() => handleAddPlayerToTeam(row.id, "8U", row.teamName, row.type)}>
                  Add Player to Team
                </Button>{'    '}
                <Button key="addCoach" variant="link" form="add-coach-form" onClick={() => handleAddCoachToTeam(row.id, "8U", row.teamName)}>
                  Add Coach to Team
                </Button>{'    '}
                <Button key="removeTeam" variant="link" form="remove-team-form" onClick={() => handleRemoveTeam(row.id, row.teamName)}>
                  Remove this Team
                </Button>{'    '}
              </CardHeader>
              <CardBody>
                <Title headingLevel="h2" size="lg">Coaching Staff</Title>
                <TableComposable variant={TableVariant.default} aria-label="coach+{row.teamName}+table">
                    <Thead>
                      <Tr>
                        <Th sort={getCoachSortParams(0)}>{coachColumnNames.coachName}</Th>
                        <Th sort={getCoachSortParams(1)}>{coachColumnNames.coachPhone}</Th>
                        <Th sort={getCoachSortParams(2)}>{coachColumnNames.coachEmail}</Th>
                        <Th>{coachColumnNames.coachTitle}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {!coachLoading && coachData
                      .filter(function (data) {
                        return ( (data.id === row.headcoach) ||
                                 (data.id === row.assistantcoach1) ||
                                 (data.id === row.assistantcoach2) );
                      })
                      .map((coach => (
                        <CoachTeamEditTableRow
                          key={"CoachForTeam_"+coach.id}
                          currentRow={coach}
                          division="8U"
                          teamName={row.teamName}
                          teamId={row.id}
                          headcoach={row.headcoach}
                          assistant1={row.assistantcoach1}
                          assistant2={row.assistantcoach2}
                          fetchCoach={fetchCoach}
                          addSuccessAlert={addSuccessAlert} 
                          addFailureAlert={addFailureAlert}
                        />
                      )))}
                    </Tbody>
                  </TableComposable>
                <Text component="br" />
                <Text component="br" />
                <Title headingLevel="h2" size="lg">Roster</Title>
                <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
                  <Thead>
                    <Tr>
                      <Th sort={getSortParams(0)}>{columnNames.playerName}</Th>
                      <Th sort={getSortParams(1)}>{columnNames.playerNumber}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                  {!playerLoading &&  playerData  
                  .filter(function (data) {
                    return data.teamId === row.id;
                  })
                  .map((player => (
                    <PlayerTeamEditTableRow
                      key={"PlayerOnTeam_"+player.id}
                      currentRow={player}
                      division="8U"
                      teamName={row.teamName}
                      fetchPlayers={fetchPlayers}
                      addSuccessAlert={addSuccessAlert} 
                      addFailureAlert={addFailureAlert}
                    />
                  )))}
                  </Tbody>
                </TableComposable>
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
          )))}
            </React.Fragment>
          </TabContent>
          <TabContent key={2} eventKey={2} id={`tabContent${2}`} activeKey={activeTabKey} hidden={2 !== activeTabKey}>
            {teamLoading && (
              <Bullseye>
                <Spinner size="xl" />
              </Bullseye>
            )}
            {!teamLoading && teamData?.length === 0 && (
              <Bullseye>
                <EmptyState variant={EmptyStateVariant.small}>
                  <EmptyStateIcon icon={SearchIcon} />
                  <Title headingLevel="h2" size="lg">
                    No Team information retrieved!
                  </Title>
                  <EmptyStateBody>
                    Check your network connection or contact the system administrator.
                  </EmptyStateBody>
                </EmptyState>
              </Bullseye>
            )}
            <React.Fragment key="10u_teams">
            {!teamLoading && teamData
              .filter(function (data) {
                return data.division === "10U";
              })
              .map((row => (
                <Card key={row.id} isSelectable>
                  <CardHeader>
                    <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>{'  '}
                    <Text component="br" />
                    <Button key="addPlayer" variant="link" form="add-player-form" onClick={() => handleAddPlayerToTeam(row.id, "10U", row.teamName, row.type)}>
                      Add Player to Team
                    </Button>{'    '}
                    <Button key="addCoach" variant="link" form="add-coach-form" onClick={() => handleAddCoachToTeam(row.id, "10U", row.teamName)}>
                      Add Coach to Team
                    </Button>{'    '}
                    <Button key="removeTeam" variant="link" form="remove-team-form" onClick={() => handleRemoveTeam(row.id, row.teamName)}>
                      Remove this Team
                    </Button>{'    '}
                  </CardHeader>
                  <CardBody>
                    <Title headingLevel="h2" size="lg">Coaching Staff</Title>
                    <TableComposable variant={TableVariant.default} aria-label="coach+{row.teamName}+table" isStriped>
                        <Thead>
                          <Tr>
                            <Th sort={getCoachSortParams(0)}>{coachColumnNames.coachName}</Th>
                            <Th sort={getCoachSortParams(1)}>{coachColumnNames.coachPhone}</Th>
                            <Th sort={getCoachSortParams(2)}>{coachColumnNames.coachEmail}</Th>
                            <Th>{coachColumnNames.coachTitle}</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {!coachLoading && coachData
                          .filter(function (data) {
                            return ( (data.id === row.headcoach) ||
                                     (data.id === row.assistantcoach1) ||
                                     (data.id === row.assistantcoach2) );
                          })
                          .map((coach => (
                            <CoachTeamEditTableRow
                              key={"CoachForTeam_"+coach.id}
                              currentRow={coach}
                              division="10U"
                              teamName={row.teamName}
                              teamId={row.id}
                              headcoach={row.headcoach}
                              assistant1={row.assistantcoach1}
                              assistant2={row.assistantcoach2}
                              fetchCoach={fetchCoach}
                              addSuccessAlert={addSuccessAlert} 
                              addFailureAlert={addFailureAlert}
                            />
                          )))}
                        </Tbody>
                      </TableComposable>
                    <Text component="br" />
                    <Text component="br" />
                    <Title headingLevel="h2" size="lg">Roster</Title>
                    <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table" isStriped>
                      <Thead>
                        <Tr>
                          <Th sort={getSortParams(0)}>{columnNames.playerName}</Th>
                          <Th sort={getSortParams(1)}>{columnNames.playerNumber}</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                      {!playerLoading && playerData
                      .filter(function (data) {
                        return data.teamId === row.id;
                      })
                      .map((player => (
                        <PlayerTeamEditTableRow
                          key={"PlayerOnTeam_"+player.id}
                          currentRow={player}
                          division="10U"
                          teamName={row.teamName}
                          fetchPlayers={fetchPlayers}
                          addSuccessAlert={addSuccessAlert} 
                          addFailureAlert={addFailureAlert}
                        />
                      )))}
                      </Tbody>
                    </TableComposable>
                  </CardBody>
                  <CardFooter>
                  </CardFooter>
                </Card>
                )))}
                </React.Fragment>
                </TabContent>
                <TabContent key={3} eventKey={3} id={`tabContent${3}`} activeKey={activeTabKey} hidden={3 !== activeTabKey}>
                {teamLoading && (
                      <Bullseye>
                        <Spinner size="xl" />
                      </Bullseye>
                    )}
                    {!teamLoading && teamData?.length === 0 && (
                      <Bullseye>
                        <EmptyState variant={EmptyStateVariant.small}>
                          <EmptyStateIcon icon={SearchIcon} />
                            <Title headingLevel="h2" size="lg">
                              No Team information retrieved!
                           </Title>
                         <EmptyStateBody>
                           Check your network connection or contact the system administrator.
                         </EmptyStateBody>
                        </EmptyState>
                     </Bullseye>
                    )}
                    <React.Fragment key="12u_teams">
                    {!teamLoading && teamData
                    .filter(function (data) {
                      return data.division === "12U";
                    })
                    .map((row => (
                      <Card key={row.id} isSelectable>
                      <CardHeader>
                        <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>{'  '}
                        <Text component="br" />
                        <Button key="addPlayer" variant="link" form="add-player-form" onClick={() => handleAddPlayerToTeam(row.id, "12U", row.teamName, row.type)}>
                          Add Player to Team
                        </Button>{'    '}
                        <Button key="addCoach" variant="link" form="add-coach-form" onClick={() => handleAddCoachToTeam(row.id, "12U", row.teamName)}>
                          Add Coach to Team
                        </Button>{'    '}
                        <Button key="removeTeam" variant="link" form="remove-team-form" onClick={() => handleRemoveTeam(row.id, row.teamName)}>
                          Remove this Team
                        </Button>{'    '}
                      </CardHeader>
                      <CardBody>
                        <Title headingLevel="h2" size="lg">Coaching Staff</Title>
                        <TableComposable variant={TableVariant.default} aria-label="coach+{row.teamName}+table">
                            <Thead>
                              <Tr>
                                <Th sort={getCoachSortParams(0)}>{coachColumnNames.coachName}</Th>
                                <Th sort={getCoachSortParams(1)}>{coachColumnNames.coachPhone}</Th>
                                <Th sort={getCoachSortParams(2)}>{coachColumnNames.coachEmail}</Th>
                                <Th>{coachColumnNames.coachTitle}</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {!coachLoading && coachData
                              .filter(function (data) {
                                return ( (data.id === row.headcoach) ||
                                         (data.id === row.assistantcoach1) ||
                                         (data.id === row.assistantcoach2) );
                              })
                              .map((coach => (
                                <CoachTeamEditTableRow
                                  key={"CoachForTeam_"+coach.id}
                                  currentRow={coach}
                                  division="12U"
                                  teamName={row.teamName}
                                  teamId={row.id}
                                  headcoach={row.headcoach}
                                  assistant1={row.assistantcoach1}
                                  assistant2={row.assistantcoach2}
                                  fetchCoach={fetchCoach}
                                  addSuccessAlert={addSuccessAlert} 
                                  addFailureAlert={addFailureAlert}
                                />
                              )))}
                            </Tbody>
                          </TableComposable>
                        <Text component="br" />
                        <Text component="br" />
                        <Title headingLevel="h2" size="lg">Roster</Title>
                        <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
                          <Thead>
                            <Tr>
                              <Th sort={getSortParams(0)}>{columnNames.playerName}</Th>
                              <Th sort={getSortParams(1)}>{columnNames.playerNumber}</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                          {!playerLoading && playerData
                          .filter(function (data) {
                            return data.teamId === row.id;
                          })
                          .map((player => (
                            <PlayerTeamEditTableRow
                              key={"PlayerOnTeam_"+player.id}
                              currentRow={player}
                              division="12U"
                              teamName={row.teamName}
                              fetchPlayers={fetchPlayers}
                              addSuccessAlert={addSuccessAlert} 
                              addFailureAlert={addFailureAlert}
                            />
                          )))}
                          </Tbody>
                        </TableComposable>
                      </CardBody>
                      <CardFooter>
                      </CardFooter>
                    </Card>
                        )))}
                    </React.Fragment>
                </TabContent>
                <TabContent key={4} eventKey={4} id={`tabContent${4}`} activeKey={activeTabKey} hidden={4 !== activeTabKey}>
                {teamLoading && (
                      <Bullseye>
                        <Spinner size="xl" />
                      </Bullseye>
                    )}
                    {!teamLoading && teamData?.length === 0 && (
                      <Bullseye>
                        <EmptyState variant={EmptyStateVariant.small}>
                          <EmptyStateIcon icon={SearchIcon} />
                            <Title headingLevel="h2" size="lg">
                              No Team information retrieved!
                           </Title>
                         <EmptyStateBody>
                           Check your network connection or contact the system administrator.
                         </EmptyStateBody>
                        </EmptyState>
                     </Bullseye>
                    )}
                    <React.Fragment key="14u_teams">
                    {!teamLoading && teamData
                    .filter(function (data) {
                      return data.division === "14U";
                    })
                    .map((row => (
                      <Card key={row.id} isSelectable>
                      <CardHeader>
                        <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>{'  '}
                        <Text component="br" />
                        <Button key="addPlayer" variant="link" form="add-player-form" onClick={() => handleAddPlayerToTeam(row.id, "14U", row.teamName, row.type)}>
                          Add Player to Team
                        </Button>{'    '}
                        <Button key="addCoach" variant="link" form="add-coach-form" onClick={() => handleAddCoachToTeam(row.id, "14U", row.teamName)}>
                          Add Coach to Team
                        </Button>{'    '}
                        <Button key="removeTeam" variant="link" form="remove-team-form" onClick={() => handleRemoveTeam(row.id, row.teamName)}>
                          Remove this Team
                        </Button>{'    '}
                      </CardHeader>
                      <CardBody>
                        <Title headingLevel="h2" size="lg">Coaching Staff</Title>
                        <TableComposable variant={TableVariant.default} aria-label="coach+{row.teamName}+table">
                            <Thead>
                              <Tr>
                                <Th sort={getCoachSortParams(0)}>{coachColumnNames.coachName}</Th>
                                <Th sort={getCoachSortParams(1)}>{coachColumnNames.coachPhone}</Th>
                                <Th sort={getCoachSortParams(2)}>{coachColumnNames.coachEmail}</Th>
                                <Th>{coachColumnNames.coachTitle}</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {!coachLoading && coachData
                              .filter(function (data) {
                                return ( (data.id === row.headcoach) ||
                                         (data.id === row.assistantcoach1) ||
                                         (data.id === row.assistantcoach2) );
                              })
                              .map((coach => (
                                <CoachTeamEditTableRow
                                  key={"CoachForTeam_"+coach.id}
                                  currentRow={coach}
                                  division="14U"
                                  teamName={row.teamName}
                                  teamId={row.id}
                                  headcoach={row.headcoach}
                                  assistant1={row.assistantcoach1}
                                  assistant2={row.assistantcoach2}
                                  fetchCoach={fetchCoach}
                                  addSuccessAlert={addSuccessAlert} 
                                  addFailureAlert={addFailureAlert}
                                />
                              )))}
                            </Tbody>
                          </TableComposable>
                        <Text component="br" />
                        <Text component="br" />
                        <Title headingLevel="h2" size="lg">Roster</Title>
                        <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
                          <Thead>
                            <Tr>
                              <Th sort={getSortParams(0)}>{columnNames.playerName}</Th>
                              <Th sort={getSortParams(1)}>{columnNames.playerNumber}</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                          {!playerLoading && playerData
                          .filter(function (data) {
                            return data.teamId === row.id;
                          })
                          .map((player => (
                            <PlayerTeamEditTableRow
                              key={"PlayerOnTeam_"+player.id}
                              currentRow={player}
                              division="14U"
                              teamName={row.teamName}
                              fetchPlayers={fetchPlayers}
                              addSuccessAlert={addSuccessAlert} 
                              addFailureAlert={addFailureAlert}
                            />
                          )))}
                          </Tbody>
                        </TableComposable>
                      </CardBody>
                      <CardFooter>
                      </CardFooter>
                    </Card>
                        )))}
                  </React.Fragment>
                </TabContent>
                <TabContent key={5} eventKey={5} id={`tabContent${5}`} activeKey={activeTabKey} hidden={5 !== activeTabKey}>
                {teamLoading && (
                      <Bullseye>
                        <Spinner size="xl" />
                      </Bullseye>
                    )}
                    {!teamLoading && teamData?.length === 0 && (
                      <Bullseye>
                        <EmptyState variant={EmptyStateVariant.small}>
                          <EmptyStateIcon icon={SearchIcon} />
                            <Title headingLevel="h2" size="lg">
                              No Team information retrieved!
                           </Title>
                         <EmptyStateBody>
                           Check your network connection or contact the system administrator.
                         </EmptyStateBody>
                        </EmptyState>
                     </Bullseye>
                    )}
                    <React.Fragment key="16u_teams">
                    {!teamLoading && teamData
                    .filter(function (data) {
                      return data.division === "16U";
                    })
                    .map((row => (
                      <Card key={row.id} isSelectable>
                      <CardHeader>
                        <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>{'  '}
                        <Text component="br" />
                        <Button key="addPlayer" variant="link" form="add-player-form" onClick={() => handleAddPlayerToTeam(row.id, "16U", row.teamName, row.type)}>
                          Add Player to Team
                        </Button>{'    '}
                        <Button key="addCoach" variant="link" form="add-coach-form" onClick={() => handleAddCoachToTeam(row.id, "16U", row.teamName)}>
                          Add Coach to Team
                        </Button>{'    '}
                        <Button key="removeTeam" variant="link" form="remove-team-form" onClick={() => handleRemoveTeam(row.id, row.teamName)}>
                          Remove this Team
                        </Button>{'    '}
                      </CardHeader>
                      <CardBody>
                        <Title headingLevel="h2" size="lg">Coaching Staff</Title>
                        <TableComposable variant={TableVariant.default} aria-label="coach+{row.teamName}+table">
                            <Thead>
                              <Tr>
                                <Th sort={getCoachSortParams(0)}>{coachColumnNames.coachName}</Th>
                                <Th sort={getCoachSortParams(1)}>{coachColumnNames.coachPhone}</Th>
                                <Th sort={getCoachSortParams(2)}>{coachColumnNames.coachEmail}</Th>
                                <Th>{coachColumnNames.coachTitle}</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {!coachLoading && coachData
                              .filter(function (data) {
                                return ( (data.id === row.headcoach) ||
                                         (data.id === row.assistantcoach1) ||
                                         (data.id === row.assistantcoach2) );
                              })
                              .map((coach => (
                                <CoachTeamEditTableRow
                                  key={"CoachForTeam_"+coach.id}
                                  currentRow={coach}
                                  division="16U"
                                  teamName={row.teamName}
                                  teamId={row.id}
                                  headcoach={row.headcoach}
                                  assistant1={row.assistantcoach1}
                                  assistant2={row.assistantcoach2}
                                  fetchCoach={fetchCoach}
                                  addSuccessAlert={addSuccessAlert} 
                                  addFailureAlert={addFailureAlert}
                                />
                              )))}
                            </Tbody>
                          </TableComposable>
                        <Text component="br" />
                        <Text component="br" />
                        <Title headingLevel="h2" size="lg">Roster</Title>
                        <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
                          <Thead>
                            <Tr>
                              <Th sort={getSortParams(0)}>{columnNames.playerName}</Th>
                              <Th sort={getSortParams(1)}>{columnNames.playerNumber}</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                          {!playerLoading && playerData
                          .filter(function (data) {
                            return data.teamId === row.id;
                          })
                          .map((player => (
                            <PlayerTeamEditTableRow
                              key={"PlayerOnTeam_"+player.id}
                              currentRow={player}
                              division="16U"
                              teamName={row.teamName}
                              fetchPlayers={fetchPlayers}
                              addSuccessAlert={addSuccessAlert} 
                              addFailureAlert={addFailureAlert}
                            />
                          )))}
                          </Tbody>
                        </TableComposable>
                      </CardBody>
                      <CardFooter>
                      </CardFooter>
                    </Card>
                        )))}
                  </React.Fragment>
                </TabContent>
                <TabContent key={6} eventKey={6} id={`tabContent${6}`} activeKey={activeTabKey} hidden={6 !== activeTabKey}>
                {travelLoading && (
                  <Bullseye>
                    <Spinner size="xl" />
                  </Bullseye>
                )}
                {!travelLoading && travelData?.length === 0 && (
                  <Bullseye>
                    <EmptyState variant={EmptyStateVariant.small}>
                      <EmptyStateIcon icon={SearchIcon} />
                        <Title headingLevel="h2" size="lg">
                          No Team information retrieved!
                        </Title>
                      <EmptyStateBody>
                        Check your network connection or contact the system administrator.
                      </EmptyStateBody>
                    </EmptyState>
                  </Bullseye>
                )}
                <React.Fragment key="travel_teams">
                  {!travelLoading && travelData?.map((row => (
                <Card key={row.id} isSelectable>
                <CardHeader>
                  <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>{'  '}
                  <Text component="br" />
                  <Button key="addPlayer" variant="link" form="add-player-form" onClick={() => handleAddPlayerToTeam(row.id, row.division, row.teamName, row.type)}>
                    Add Player to Team
                  </Button>{'    '}
                  <Button key="addCoach" variant="link" form="add-coach-form" onClick={() => handleAddCoachToTeam(row.id, row.division, row.teamName)}>
                    Add Coach to Team
                  </Button>{'    '}
                  <Button key="removeTeam" variant="link" form="remove-team-form" onClick={() => handleRemoveTeam(row.id, row.teamName)}>
                    Remove this Team
                  </Button>{'    '}
                </CardHeader>
                <CardBody>
                  <Title headingLevel="h2" size="lg">Coaching Staff</Title>
                  <TableComposable variant={TableVariant.default} aria-label="coach+{row.teamName}+table">
                      <Thead>
                        <Tr>
                          <Th sort={getCoachSortParams(0)}>{coachColumnNames.coachName}</Th>
                          <Th sort={getCoachSortParams(1)}>{coachColumnNames.coachPhone}</Th>
                          <Th sort={getCoachSortParams(2)}>{coachColumnNames.coachEmail}</Th>
                          <Th>{coachColumnNames.coachTitle}</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {!coachLoading && coachData
                        .filter(function (data) {
                          return ( (data.id === row.headcoach) ||
                                   (data.id === row.assistantcoach1) ||
                                   (data.id === row.assistantcoach2) );
                        })
                        .map((coach => (
                          <CoachTeamEditTableRow
                            key={"CoachForTeam_"+coach.id}
                            currentRow={coach}
                            division="10U"
                            teamName={row.teamName}
                            teamId={row.id}
                            headcoach={row.headcoach}
                            assistant1={row.assistantcoach1}
                            assistant2={row.assistantcoach2}
                            fetchCoach={fetchCoach}
                            addSuccessAlert={addSuccessAlert} 
                            addFailureAlert={addFailureAlert}
                          />
                        )))}
                      </Tbody>
                    </TableComposable>
                  <Text component="br" />
                  <Text component="br" />
                  <Title headingLevel="h2" size="lg">Roster</Title>
                  <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
                    <Thead>
                      <Tr>
                        <Th sort={getSortParams(0)}>{columnNames.playerName}</Th>
                        <Th sort={getSortParams(1)}>{columnNames.playerNumber}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                    {!playerLoading && playerData
                    .filter(function (data) {
                      return data.teamId === row.id;
                    })
                    .map((player => (
                      <PlayerTeamEditTableRow
                        key={"PlayerOnTeam_"+player.id}
                        currentRow={player}
                        division={row.division}
                        teamName={row.teamName}
                        fetchPlayers={fetchPlayers}
                        addSuccessAlert={addSuccessAlert} 
                        addFailureAlert={addFailureAlert}
                      />
                    )))}
                    </Tbody>
                  </TableComposable>
                </CardBody>
                <CardFooter>
                </CardFooter>
              </Card>
                )))}
                  </React.Fragment>
                </TabContent>
        </PageSection>
      </div>      
    );
  }

  export default AdminTeams;
