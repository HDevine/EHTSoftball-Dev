import React, { useEffect } from 'react';
import {
  Alert, 
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateVariant,
  Spinner,
  Text,
  Title
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { Thead, TableComposable, TableVariant, Tr, Th, Tbody, Td, Caption} from '@patternfly/react-table';
import AdminCoachModal from './AdminCoachModal';
import CoachEditTableRow from './CoachEditTableRow';

export const columnNames = {
  coachName: 'Name',
  coachPhone: 'Phone Number',
  coachEmail: 'Email Address'
};

const AdminCoachTable = ({ children, ...props }) => {
  const { fetchCoach, coachData, setCoachData, coachLoading, setCoachLoading, coachErr, setCoachErr } = props;
  const [activeSortIndex, setActiveSortIndex] = React.useState(0);
  const [activeSortDirection, setActiveSortDirection] = React.useState('asc');
  const getSortableRowValues = coach => {
    const {name, phone, email} = coach;
    return [name, phone, email];
  };
  const [coachAdded, setCoachAdded] = React.useState(false);
  const [alerts, setAlerts] = React.useState([]);

  if (coachData?.length > 0) {
    let sortedCoach = coachData;
    if (sortedCoach !== null) {
      sortedCoach = coachData.sort((a, b) => {
        const aValue = getSortableRowValues(a)[activeSortIndex];
        const bValue = getSortableRowValues(b)[activeSortIndex];
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

  const getSortParams = columnIndex => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex
  });

  useEffect(() => {
    // Fetch data for Coaches
      fetchCoach();
      setCoachAdded(false);
    }, []);
  
  useEffect(() => {
  // Fetch data for Coaches when new coach added
    fetchCoach();
  }, [coachAdded]);
  
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

  return (
    <React.Fragment>
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
      <AdminCoachModal setCoachAdded={setCoachAdded} addSuccessAlert={addSuccessAlert} addFailureAlert={addFailureAlert} />
      <Text component="br" />
      <Text component="br" />
      <Text component="hr" />
      <TableComposable variant={TableVariant.default}  aria-label="Coaches Table" isStriped>
        <Caption>EHT Softball - Coaches</Caption>
        <Thead>
       <Tr>
          <Th sort={getSortParams(0)}>{columnNames.coachName}</Th>
          <Th sort={getSortParams(1)}>{columnNames.coachPhone}</Th>
          <Th sort={getSortParams(2)}>{columnNames.coachEmail}</Th>
       </Tr>
       </Thead>
        <Tbody>
          {!coachLoading && coachData?.length === 0 && (
            <Tr key="0">
              <Td colSpan={4}>
                <Bullseye>
                  <EmptyState variant={EmptyStateVariant.small}>
                    <EmptyStateIcon icon={SearchIcon} />
                    <Title headingLevel="h2" size="lg">
                      No Coach information retrieved!
                    </Title>
                    <EmptyStateBody>
                      Check your network connection or contact the system administrator.
                    </EmptyStateBody>
                  </EmptyState>
                </Bullseye>
              </Td>
            </Tr>
          )}
          {!coachLoading && coachData?.map((row, rowIndex) => (
            <CoachEditTableRow
              key={row.id}
              currentRow={row}
              fetchCoach={fetchCoach}
              addSuccessAlert={addSuccessAlert} 
              addFailureAlert={addFailureAlert}
            />
         ))}
         {coachLoading && (
            <Tr>
              <Td colSpan={4}>
              <Bullseye>
                <Spinner size="xl" />
              </Bullseye>
           </Td>
            </Tr>
          )}
      </Tbody>
      </TableComposable>
    </React.Fragment>
  );
}

export default AdminCoachTable;

