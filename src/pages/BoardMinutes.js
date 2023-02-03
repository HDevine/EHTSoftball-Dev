import React, { useEffect } from 'react';
import {
  Banner,
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Spinner,
  Text,
  TextContent,
  Title
} from '@patternfly/react-core';
import { Thead, TableComposable, Tr, Th, Tbody, Td} from '@patternfly/react-table';

const BoardMinutes = ({ children }) => {
  const [mtgData, setMtgData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);
  const [minutesData, setMinutesData] = React.useState(null);
  const [minutesLoading, setMinutesLoading] = React.useState(true);
  const [minutesErr, setMinutesErr] = React.useState(null);
  const [activeSortIndex, setActiveSortIndex] = React.useState(0);
  const [activeSortDirection, setActiveSortDirection] = React.useState('asc');
  const getSortableRowValues = mtgMinutes => {
    const {date, minutes} = mtgMinutes;
    return [date, minutes];
  };

  if (minutesData?.length > 0) {
    let sortedMinutes = minutesData?.data;
    if (sortedMinutes !== null) {
      sortedMinutes = minutesData?.sort((a, b) => {
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
    // Fetch data for Board Meetings
    fetch(`http://softball-pi4/db/GetBoardMeetings.php`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setMtgData(jsonResponse);
      setLoading(false);
    })
    .catch(err => {
      setErr(err);
      setLoading(false);
    })
  }, []);

  useEffect(() => {
    fetch(`http://softball-pi4/db/GetBoardMinutes.php`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setMinutesData(jsonResponse);
      setMinutesLoading(false);
    })
    .catch(err => {
      setMinutesErr(err);
      setMinutesLoading(false);
    })
  }, []);

    return (
      <React.Fragment>
        <div>
          <TextContent>
            <Text component="h1">Board Meetings</Text>
            <Text component="h2">
              Board meetings will take place at the Field House at Childs-Kirk Memorial Park, located at 31 Idlewood Ave.  Meetings will usually take place at 6:30pm on the 3rd Sunday of the month, unless the board members schedule a meeting for a month to take place at another time.
            </Text>
            <Text component="hr" />
          </TextContent>
          <Banner variant="info">Upcoming Meetings</Banner>

          <TableComposable
            aria-label="Board Meeting Dates"
          >
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!loading && mtgData?.map(row => (
                <Tr key={row.id}>
                  <Td dataLabel="Date">{row.date}</Td>
                  <Td dataLabel="Time">{row.time}</Td>
                </Tr>
              ))}
              {loading && (
                <Tr>
                  <Td colSpan={2}>
                    <Bullseye>
                      <Spinner size="xl" />
                    </Bullseye>
                  </Td>
                </Tr>
              )}
              {!loading && mtgData?.length === 0 && (
                <Tr>
                  <Td colSpan={2}>
                    <EmptyState variant={EmptyStateVariant.small}>
                      <Title headingLevel="h2" size="lg">
                        No Board Meetings Found
                      </Title>
                      <EmptyStateBody>
                        No Board Meetings are available at this time.
                      </EmptyStateBody>
                    </EmptyState>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </TableComposable>

          <Banner variant="info">Previous Meeting Minutes</Banner>
          <TableComposable
            aria-label="Board Meeting minutes"
          >
            <Thead>
              <Tr>
                <Th sort={getSortParams(0)}>Date</Th>
                <Th sort={getSortParams(1)}>Minutes</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!minutesLoading && minutesData?.map(post => (
                <Tr key={post.id}>
                  <Td dataLabel="Date">{post.date}</Td>
                  <Td dataLabel="Minutes">
		                {post.minutes && (<a href={`${post.minutes}`} target="_blank" rel="noreferrer">Minutes for {post.date}</a>)}
		                {!post.minutes && `No minutes exist for ${post.date}`}
		              </Td>
                </Tr>
              ))}
              {minutesLoading && (
                <Tr>
                  <Td colSpan={2}>
                    <Bullseye>
                      <Spinner size="xl" />
                    </Bullseye>
                  </Td>
                </Tr>
              )}
              {!minutesLoading && minutesData?.length === 0 && (
                <Tr>
                  <Td colSpan={2}>
                    <EmptyState variant={EmptyStateVariant.small}>
                      <Title headingLevel="h2" size="lg">
		                    No Board Minutes Found
		                  </Title>
		                  <EmptyStateBody>
		                    No Board Meeting Minutes are available at this time.
		                  </EmptyStateBody>
                    </EmptyState>
                  </Td>
                </Tr>
              )}
	          </Tbody>
          </TableComposable>
        </div>
      </React.Fragment>
    );
}

export default BoardMinutes;

