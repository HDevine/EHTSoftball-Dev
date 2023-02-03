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
  Spinner,
  Tabs,
  Tab,
  TabContent,
  TabTitleText,
  Text,
  TextVariants,
  Title
} from '@patternfly/react-core';
import { Thead, TableComposable, TableVariant, Tr, Th, Tbody, Td} from '@patternfly/react-table';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';

const RecTeams = ({ children }) => {
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
    fetch(`http://softball-pi4/db/GetRecTeams.php`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setTeamData(jsonResponse);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    })
  }, []);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
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
      <PageSection variant={PageSectionVariants.light} isWidthLimited key="pageSectionHeading">
  	  <Flex
        spaceItems={{ default: 'spaceItemsMd' }}
	      alignItems={{ default: 'alignItemsFlexStart' }}
	      flexWrap={{ default: 'noWrap' }}
	    >
	      <FlexItem>
	        <Title headingLevel="h1" size="2x1">
	          EHT Recreation Teams
	        </Title>
	      </FlexItem>
      </Flex>
	    </PageSection>
	    <PageSection type="tabs" variant={PageSectionVariants.light} isWidthLimited key="pageSectionTabs">
	      <Tabs activeKey={activeTabKey} onSelect={handleTabClick} usePageInsets id="tabRecTeams" isBox isFilled>
          <Tab 
	          eventKey={0} 
	          title={<TabTitleText>6U</TabTitleText>}
	          tabContentId={`tabContent${0}`}
	        />
            <Tab
	            eventKey={1}
	            title={<TabTitleText>8U</TabTitleText>}
	            tabContentId={`tabContent${1}`}
	          />
            <Tab
	            eventKey={2}
	            title={<TabTitleText>10U</TabTitleText>}
	            tabContentId={`tabContent${2}`}
	          />
            <Tab
	            eventKey={3}
	            title={<TabTitleText>12U</TabTitleText>}
	            tabContentId={`tabContent${3}`}
	          />
            <Tab
	            eventKey={4}
	            title={<TabTitleText>14U</TabTitleText>}
	            tabContentId={`tabContent${4}`}
	          />
            <Tab
	            eventKey={5}
	            title={<TabTitleText>16U</TabTitleText>}
	            tabContentId={`tabContent${5}`}
	          />
	        </Tabs>
	    </PageSection>
	    <PageSection variant={PageSectionVariants.light} isWidthLimited key="pageSectionTeamTabs">
	      <TabContent key={0} eventKey={0} id={`tabContent${0}`} activeKey={activeTabKey} hidden={0 !== activeTabKey}>
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
          <React.Fragment key="6u_teams">
            {!loading && teamData
              .filter(function (data) {
                return data.division === "6U";
              })
              .map((row => (
                <Card key={row.id}>
                  <CardHeader>
                    <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>
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
                      <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
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
                )))}
              </React.Fragment>
	        </TabContent>
          <TabContent key={1} eventKey={1} id={`tabContent${1}`} activeKey={activeTabKey} hidden={1 !== activeTabKey}>
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
                    <React.Fragment key="8u_teams">
                    {!loading && teamData
                    .filter(function (data) {
                      return data.division === "8U";
                    })
                    .map((row => (
                      <Card key={row.id}>
                        <CardHeader>
                        <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>
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
                            <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
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
                    )))}
                  </React.Fragment>
            </TabContent>
                <TabContent key={2} eventKey={2} id={`tabContent${2}`} activeKey={activeTabKey} hidden={2 !== activeTabKey}>
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
                    <React.Fragment key="10u_teams">
                    {!loading && teamData
                    .filter(function (data) {
                      return data.division === "10U";
                    })
                    .map((row => (
                      <Card key={row.id}>
                        <CardHeader>
                        <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>
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
                            <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
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
                    )))}
                  </React.Fragment>
                </TabContent>
                <TabContent key={3} eventKey={3} id={`tabContent${3}`} activeKey={activeTabKey} hidden={3 !== activeTabKey}>
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
                    <React.Fragment key="12u_teams">
                    {!loading && teamData
                    .filter(function (data) {
                      return data.division === "12U";
                    })
                    .map((row => (
                      <Card key={row.id}>
                        <CardHeader>
                          <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>
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
                            <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
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
                    )))}
                    </React.Fragment>
                </TabContent>
                <TabContent key={4} eventKey={4} id={`tabContent${4}`} activeKey={activeTabKey} hidden={4 !== activeTabKey}>
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
                    <React.Fragment key="14u_teams">
                    {!loading && teamData
                    .filter(function (data) {
                      return data.division === "14U";
                    })
                    .map((row => (
                      <Card key={row.id}>
                        <CardHeader>
                          <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>
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
                            <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
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
                    )))}
                  </React.Fragment>
                </TabContent>
                <TabContent key={5} eventKey={5} id={`tabContent${5}`} activeKey={activeTabKey} hidden={5 !== activeTabKey}>
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
                    <React.Fragment>
                    {!loading && teamData
                    .filter(function (data) {
                      return data.division === "16U";
                    })
                    .map((row => (
                      <Card key={row.id}>
                        <CardHeader>
                          <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>
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
                            <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
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
                    )))}
                  </React.Fragment>
                </TabContent>
    	</PageSection>
    </div>
  );
}

export default RecTeams;

