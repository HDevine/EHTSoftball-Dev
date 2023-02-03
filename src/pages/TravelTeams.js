import React, { useEffect } from 'react';
import {
  Bullseye,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateVariant,
  Flex,
  FlexItem,
  Label,
  PageSection,
  PageSectionVariants,
  SimpleList,
  SimpleListItem,
  Spinner,
  Tabs,
  Tab,
  TabContent,
  TabContentBody,
  TabTitleText,
  Text,
  TextVariants,
  Title
} from '@patternfly/react-core';
import { Thead, TableComposable, TableVariant, Tr, Th, Tbody, Td} from '@patternfly/react-table';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';

const TravelTeams = ({ children }) => {
  const [activeTabKey, setActiveTabKey] = React.useState(0);
  const [teamData, setTeamData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [playerData, setPlayerData] = React.useState(null);
  const [playerLoading, setPlayerLoading] = React.useState(true);
  const [playerError, setPlayerError] = React.useState(null);
  const [coachData, setCoachData] = React.useState(null);
  const [coachLoading, setCoachLoading] = React.useState(true);
  const [coachError, setCoachError] = React.useState(null);

  useEffect(() => {
  // Fetch data for Rec Teams
    fetch(`http://softball-pi4/db/GetTravelTeams.php`)
      .then(async resp => {
        const jsonResponse = await resp.json()
        setTeamData(jsonResponse);
        setLoading(false);

        // Since the Teams data contains both Rec and Travel Teams, we cannot assume that the
        // default Travel Team tab index will be 0; so use the first travel team discovered.
        if (Array.isArray(teamData)){
          setActiveTabKey(teamData[0].id);
          console.log(teamData[0].id, activeTabKey);
        }
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      })

      // Fetch data for Players
      fetch(`http://softball-pi4/db/GetPlayers.php`)
      .then(async resp => {
        const jsonResponse = await resp.json()
        setPlayerData(jsonResponse);
        setPlayerLoading(false);
      })
      .catch(err => {
        setPlayerError(err);
        setPlayerLoading(false);
      })

      // Fetch data for Coaches
      fetch(`http://softball-pi4/db/GetCoaches.php`)
      .then(async resp => {
        const jsonResponse = await resp.json()
        setCoachData(jsonResponse);
        setCoachLoading(false);
      })
      .catch(err => {
        setCoachError(err);
        setCoachLoading(false);
      })

    }, []);

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <div>
      <PageSection variant={PageSectionVariants.light} key="travelTeamsHeadingSection">
  	  <Flex
        spaceItems={{ default: 'spaceItemsMd' }}
	      alignItems={{ default: 'alignItemsFlexStart' }}
	      flexWrap={{ default: 'noWrap' }}
	    >
	      <FlexItem>
	        <Title headingLevel="h1" size="2xl">
	          EHT Travel Teams
	        </Title>
	      </FlexItem>
      </Flex>
	    </PageSection>
        {loading && (
          <Bullseye>
            <Spinner size="xl" />
          </Bullseye>
        )}
        {!loading && teamData?.length === 0 && (
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
      <PageSection type="tabs" variant={PageSectionVariants.light} key="travelTeamContentTabs">
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} usePageInsets isBox id="tabTravelTeams" aria-label="tabTravelTeams">
        {!loading && teamData?.map((row, rowIndex) => (
          <Tab 
            key={`tab${rowIndex}`}
            eventKey={row.id} 
            title={<TabTitleText>{row.teamName}</TabTitleText>}
            tabContentId={`tabContent${row.id}`}
          />
        ))}
        </Tabs>
      </PageSection>
      {!loading && teamData?.map((row, rowIndex) => (
        <TabContent key={row.id} eventKey={row.id} id={`tabContent${row.id}`} activeKey={activeTabKey} hidden={row.id !== activeTabKey}>
          <React.Fragment key={`travelTeamContent${rowIndex}`}>
            <Card key={`team${rowIndex}`}>
              <CardHeader>
                <Label icon={<InfoCircleIcon />} color={row.teamColor} >{row.teamName}</Label>
              </CardHeader>
              <CardBody>
                <Title headingLevel="h2" size="lg">Coaching Staff</Title>
                <TableComposable variant={TableVariant.default} aria-label={`coachesr${row.teamName}table`}>
                    <Thead>
                      <Tr>
                        <Th width={25}>Coach</Th>
                        <Th width={25}>Phone Number</Th>
                        <Th width={25}>Email Address</Th>
                        <Th width={25}>Title</Th>
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
                        <Tr key={"coach"+coach.id}>
                        <Td>{coach.name}</Td>
                        <Td>{coach.phone}</Td>
                        <Td>{coach.email}</Td>
                        <Td>
                          {(coach?.id === row.headcoach) && (
                            <Text component={TextVariants.h6}>Head Coach</Text>
                          )}
                          {(coach?.id === row.assistantcoach1) && (
                            <Text component={TextVariants.h6}>First Assistant Coach</Text>
                          )}
                          {(coach?.id === row.assistantcoach2) && (
                            <Text component={TextVariants.h6}>Second Assistant Coach</Text>
                          )}
                        </Td>
                      </Tr>
                    )))}
                    </Tbody>
                  </TableComposable>
                  <Text component="br" />
                  <Text component="br" />
                <Title headingLevel="h2" size="lg">Roster</Title>
                <TableComposable variant={TableVariant.default} aria-label={`roster${row.teamName}table`}>
                  <Thead>
                    <Tr>
                      <Th width={50}>Name</Th>
                      <Th width={50}>Jersey Number</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                  {!playerLoading && playerData
                    .filter(function (data) {
                      return data.teamId === row.id;
                    })
                    .map((player => (
                      <Tr key={"player"+player.id}>
                        <Td>{player.playerName}</Td>
                        <Td>{player.playerNumber}</Td>
                      </Tr>
                    )))}
                  </Tbody>
                </TableComposable>
              </CardBody>
            </Card>
          </React.Fragment>
        </TabContent>
        ))}
    </div>
  );
}

export default TravelTeams;

