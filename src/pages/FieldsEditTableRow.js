import * as React from 'react';
import { 
  Button, 
  TextInput, 
  Switch
} from '@patternfly/react-core';
import { Tr, Td } from '@patternfly/react-table';
import { columnNames } from './AdminFieldsTable';
import ConfirmDialog from './ConfirmDialog';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';
import Remove2Icon from '@patternfly/react-icons/dist/esm/icons/remove2-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import CheckIcon from '@patternfly/react-icons/dist/esm/icons/check-icon';

const FieldsEditTableRow = ({ children, ...props }) => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const {key, currentField, fetchFieldInfo, addSuccessAlert, addFailureAlert } = props;
  const [editedFieldNum, setEditedFieldNum] = React.useState(currentField.fieldNum);
  const [editedFieldStatus, setEditedFieldStatus] = React.useState(currentField.fieldStatus);
  const [editedFieldReason, setEditedFieldReason] = React.useState(currentField.fieldReason);
  const [isConfirmDlgOpen, setConfirmDlgOpen] = React.useState(false);

    async function updateDatabase (url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  };

  const updateFieldInfo = (id) => {
    let updateArray = Array(id, editedFieldNum, editedFieldStatus, editedFieldReason);
    updateDatabase('http://softball-pi4/db/UpdateField.php', { updateArray })      
    .then(data => {
      if (data.message === "Field updated successfully") {
        addSuccessAlert("Field " + editedFieldNum + " updated successfully");
        fetchFieldInfo();
      }
      else {
        addFailureAlert("Field update unsuccessful");
        fetchFieldInfo();
        console.log("Error updating field info!")
      }
  });
  }

  const removeFieldInfo = async (id) => {
      setIsEditMode(false);
      let delID = Array(id);
      updateDatabase('http://softball-pi4/db/DeleteField.php', { delID })
      .then(data => {
        if (data.message === "Field deleted successfully") {
          addSuccessAlert("Field " + editedFieldNum + " deleted successfully");
          fetchFieldInfo();
        }
        else {
          addFailureAlert("Field removal unsuccessful");
          fetchFieldInfo();
          console.log("Error removing field!")
        }
      });
  }

  const handleYes = () => {
    removeFieldInfo(currentField.id);
    setConfirmDlgOpen(false);
  }

  const handleNo = () => {
    setConfirmDlgOpen(false);
  }

  return (
    <React.Fragment>
      <ConfirmDialog title={"Are you sure you want to delete this field?"} isModalOpen={isConfirmDlgOpen} handleYes={handleYes} handleNo={handleNo}/>
      <Tr key={key}>
        <Td dataLabel={columnNames.fieldNum}>
          {isEditMode ? (
            <TextInput
              value={editedFieldNum}
              type="text"
              aria-label="field-number"
              onChange={(value) => {
                setEditedFieldNum(value);
              } } />
          ) : (
            editedFieldNum
          )}
        </Td>
        <Td dataLabel={columnNames.fieldStatus}>
          {isEditMode ? (
            <Switch
              id={`switch-${currentField.id}`}
              label="Open"
              labelOff="Closed"
              isChecked={(editedFieldStatus === "Open")}
              onChange={(isChecked) => {
                setEditedFieldStatus(isChecked ? "Open" : "Closed");
              } } />
          ) : (
            editedFieldStatus
          )}
        </Td>
        <Td dataLabel={columnNames.fieldReason}>
          {isEditMode ? (
            <TextInput
              value={editedFieldReason}
              type="text"
              aria-label="field-reason"
              onChange={(value) => {
                setEditedFieldReason(value);
              } } />
          ) : (
            editedFieldReason
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
                Remove
              </Button>
            </React.Fragment>
          ) : (
            <>
              <Button
                variant="link"
                icon={<CheckIcon />}
                onClick={() => {
                  setIsEditMode(false);
                  updateFieldInfo(currentField.id);
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

export default FieldsEditTableRow;
