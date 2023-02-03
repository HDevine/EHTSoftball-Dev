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
  Text,
  TextInput,
  TextVariants
} from '@patternfly/react-core';
import { useEffect } from 'react';
import { Tr, Td } from '@patternfly/react-table';
import { columnNames } from './AdminCoachTable';
import ConfirmDialog from './ConfirmDialog';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';
import Remove2Icon from '@patternfly/react-icons/dist/esm/icons/remove2-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import CheckIcon from '@patternfly/react-icons/dist/esm/icons/check-icon';

const CoachTeamEditTableRow = ({ children, ...props }) => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const {key, currentRow, division, teamName, teamId, headcoach, assistant1, assistant2, fetchCoach, addSuccessAlert, addFailureAlert } = props;
  const [editedName, setEditedName] = React.useState(currentRow.name);
  const [editedPhone, setEditedPhone] = React.useState(currentRow.phone);
  const [editedEmail, setEditedEmail] = React.useState(currentRow.email);
  const [isConfirmDlgOpen, setConfirmDlgOpen] = React.useState(false);

  async function updateDatabase (url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  };

  const updateCoach = (id) => {
    let updateArray = Array(id, editedName, editedPhone, editedEmail);
     updateDatabase('http://softball-pi4/db/UpdateCoach.php', { updateArray })      
    .then(data => {
      if (data.message === "Coach updated successfully") {
        addSuccessAlert(editedName + " updated successfully");
        fetchCoach();
      }
      else {
        addFailureAlert(editedName + " update unsuccessful");
        fetchCoach();
        console.log("Error updating " + editedName);
      }
    });
  }

  const removeFromTeam = async (id) => {
    setIsEditMode(false);
    let field = "";
    if (currentRow.id === headcoach) {
      field = "headcoach";
    }
    if (currentRow.id === assistant1) {
      field = "assistantcoach1";
    }
    if (currentRow.id === assistant2) {
      field = "assistantcoach2";
    }
    let updateArray = Array(id, teamId, field);
    console.log(updateArray);
    updateDatabase('http://softball-pi4/db/DeleteCoachFromTeam.php', { updateArray })
    .then(data => {
      if (data.message === "Coach removed from team successfully") {
        addSuccessAlert(editedName + " removed from " + teamName + " successfully");
        fetchCoach();
      }
      else {
        addFailureAlert(editedName + " removal unsuccessful");
        fetchCoach();
        console.log("Error removing " + editedName + " from " + teamName);
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
        <Td dataLabel={columnNames.coachName}>
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
        <Td dataLabel={columnNames.coachPhone}>
          {isEditMode ? (
            <TextInput
              value={editedPhone}
              type="text"
              aria-label="edit-coach-phone"
              onChange={(value) => {
                setEditedPhone(value);
              } } />
          ) : (
            editedPhone
          )}
        </Td>
        <Td dataLabel={columnNames.coachEmail}>
          {isEditMode ? (
            <TextInput
              value={editedEmail}
              type="text"
              aria-label="edit-coach-email"
              onChange={(value) => {
                setEditedEmail(value);
              } } />
          ) : (
            editedEmail
          )}
        </Td>
        <Td dataLabel={columnNames.coachTitle}>
        {(currentRow?.id === headcoach) && (
          <Text component={TextVariants.h6}>Head Coach</Text>
        )}
        {(currentRow?.id === assistant1) && (
          <Text component={TextVariants.h6}>First Assistant Coach</Text>
        )}
        {(currentRow?.id === assistant2) && (
          <Text component={TextVariants.h6}>Second Assistant Coach</Text>
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
                  updateCoach(currentRow.id);
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

export default CoachTeamEditTableRow;
