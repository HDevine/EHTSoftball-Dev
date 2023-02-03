import * as React from 'react';
import { 
  Alert, 
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  Button, 
  Select,
  SelectDirection,
  SelectOption,
  SelectVariant,
  TextInput
} from '@patternfly/react-core';
import { Tr, Td } from '@patternfly/react-table';
import { columnNames } from './AdminTeams';
import ConfirmDialog from './ConfirmDialog';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';
import Remove2Icon from '@patternfly/react-icons/dist/esm/icons/remove2-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import CheckIcon from '@patternfly/react-icons/dist/esm/icons/check-icon';

const PlayerTeamEditTableRow = ({ children, ...props }) => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const {key, currentRow, division, teamName, fetchPlayers, addSuccessAlert, addFailureAlert } = props;
  const [editedName, setEditedName] = React.useState(currentRow.playerName);
  const [editedNumber, setEditedNumber] = React.useState(currentRow.playerNumber);
  const [isConfirmDlgOpen, setConfirmDlgOpen] = React.useState(false);

  async function updateDatabase (url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  };

  const updatePlayer = (id) => {
    let updateArray = Array(id, editedName, editedNumber, division, currentRow.type, currentRow.teamId);
    updateDatabase('http://softball-pi4/db/UpdatePlayer.php', { updateArray })      
    .then(data => {
      if (data.message === "Player updated successfully") {
        addSuccessAlert(editedName + " updated successfully");
        fetchPlayers();
      }
      else {
        addFailureAlert(editedName + " update unsuccessful");
        fetchPlayers();
        console.log("Error updating " + editedName);
      }
    });
  }

  const removeFromTeam = async (id) => {
      setIsEditMode(false);
      let playerId = Array(id);
      updateDatabase('http://softball-pi4/db/DeletePlayerFromTeam.php', { playerId })
      .then(data => {
        if (data.message === "Player/Team assignment reset successfully") {
          addSuccessAlert(editedName + " removed from " + teamName + " successfully");
          fetchPlayers();
        }
        else {
          addFailureAlert(editedName + " removal unsuccessful");
          fetchPlayers();
          console.log("Error removing " + editedName + "from " + teamName);
        }
      });
  }

  const handleYes = () => {
    removeFromTeam(currentRow.id);
    setConfirmDlgOpen(false);
  }

  const handleNo = () => {
    setConfirmDlgOpen(false);
  }

  return (
    <React.Fragment>
      <ConfirmDialog title={"Are you sure you want to remove " + editedName + " from " + teamName + "?"} isModalOpen={isConfirmDlgOpen} handleYes={handleYes} handleNo={handleNo}/>
      <Tr key={key}>
        <Td dataLabel={columnNames.playerName}>
          {isEditMode ? (
            <TextInput
              value={editedName}
              type="text"
              aria-label="edit-player-name"
              onChange={(value) => {
                setEditedName(value);
              } } />
          ) : (
            editedName
          )}
        </Td>
        <Td dataLabel={columnNames.playerNumber}>
          {isEditMode ? (
            <TextInput
              value={editedNumber}
              type="number"
              aria-label="edit-player-number"
              onChange={(value) => {
                setEditedNumber(value);
              } } />
          ) : (
            editedNumber
          )}
        </Td>
        <Td modifier="nowrap">
          {!isEditMode ? (
            <React.Fragment>
              <Button
                variant="link"
                icon={<PencilAltIcon />}
                iconPosition="right"
                onClick={() => {
                  setIsEditMode(true);
                } }
              >
                Edit
              </Button>
              <Button
                variant="link"
                icon={<Remove2Icon />}
                iconPosition="right"
                onClick={() => {
                  setConfirmDlgOpen(true);
                }}
              >
                Remove From Team
              </Button>
            </React.Fragment>
          ) : (
            <>
              <Button
                variant="link"
                icon={<CheckIcon />}
                onClick={() => {
                  setIsEditMode(false);
                  updatePlayer(currentRow.id);
                } } />
              <Button
                variant="plain"
                icon={<TimesIcon />}
                onClick={() => {
                  setIsEditMode(false);
                } }
              >
                <TimesIcon />
              </Button>
            </>
          )}
        </Td>
      </Tr>
      </React.Fragment>
  );
}

export default PlayerTeamEditTableRow;
