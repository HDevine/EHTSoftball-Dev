import React, { useEffect } from 'react';
import {
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
  Tabs,
  Tab,
  TabContent,
  TabContentBody,
  TabTitleText,
  Title
} from '@patternfly/react-core';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import AdminPlayersTable from './AdminPlayersTable';
import AdminCoachTable from './AdminCoachTable';
import AdminTeams from './AdminTeams'
import AdminFieldsTable from './AdminFieldsTable';
import AdminBoardMemberTable from './AdminBoardMemberTable';
import AdminBoardMeetingTable from './AdminBoardMeetingTable';
import AdminBoardMinutesTable from './AdminBoardMinutesTable';
import AdminLocalitiesTable from './AdminLocalitiesTable';
import AdminTournamentsTable from './AdminTournamentsTable';
import AdminLatestNewsTable from './AdminLatestNewsTable';
import { Loading } from './Loading'; 

const config = require('./config.js');

const Admin = ({ children }) => {

  const [activeTabKey, setActiveTabKey] = React.useState(0);
  const [activeTabKeySecondary, setActiveTabKeySecondary] = React.useState(10);
  const [playerData, setPlayerData] = React.useState(null);
  const [playerLoading, setPlayerLoading] = React.useState(true);
  const [playerErr, setPlayerErr] = React.useState(false);
  const [coachData, setCoachData] = React.useState(null);
  const [coachLoading, setCoachLoading] = React.useState(true);
  const [coachErr, setCoachErr] = React.useState(false);

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const handleTabClickSecondary = (event, tabIndex) => {
    setActiveTabKeySecondary(tabIndex);
  };

  const fetchPlayers = () => {
    // Fetch data for Players
    fetch(`http://softball-pi4/db/GetPlayers.php`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setPlayerData(jsonResponse);
      setPlayerLoading(false);
    })
    .catch(err => {
      setPlayerErr(err);
      setPlayerLoading(false);
    })
  }

  const fetchCoach = () => {
    // Fetch data for Coaches
    fetch(`http://softball-pi4/db/GetCoaches.php`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setCoachData(jsonResponse);
      setCoachLoading(false);
    })
    .catch(err => {
      setCoachErr(err);
      setCoachLoading(false);
    })
  }

  return (
    <div>
      <PageSection variant={PageSectionVariants.light} isWidthLimited key="section1">
        <Flex
          spaceItems={{ default: 'spaceItemsMd' }}
          alignItems={{ default: 'alignItemsFlexStart' }}
          flexWrap={{ default: 'noWrap' }}
        >
          <FlexItem key="admin_heading">
            <Title headingLevel="h1" size="2x1">
              EHT Softball - Admin Functions
            </Title>
          </FlexItem>
        </Flex>
      </PageSection>
      <PageSection type="tabs" variant={PageSectionVariants.light} isWidthLimited key="section2">
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} usePageInsets id="tabAdminFunctions">
          <Tab
            eventKey={0}
            title={<TabTitleText>Coaches</TabTitleText>}
            tabContentId={`tabContent${0}`}
          />
          <Tab
            eventKey={1}
            title={<TabTitleText>Players</TabTitleText>}
            tabContentId={`tabContent${1}`}
          />
          <Tab
            eventKey={2}
            title={<TabTitleText>Teams</TabTitleText>}
            tabContentId={`tabContent${2}`}
          />
          <Tab
            eventKey={3}
            title={<TabTitleText>Fields</TabTitleText>}
            tabContentId={`tabContent${3}`}
          />
          <Tab
            eventKey={4}
            title={<TabTitleText>Tournaments</TabTitleText>}
            tabContentId={`tabContent${4}`}
          />
          <Tab
            eventKey={5}
            title={<TabTitleText>Localities</TabTitleText>}
            tabContentId={`tabContent${5}`}
          />
          <Tab
            eventKey={6}
            title={<TabTitleText>Board Members</TabTitleText>}
            tabContentId={`tabContent${6}`}
          />
          <Tab
            eventKey={7}
            title={<TabTitleText>Board Meetings</TabTitleText>}
            tabContentId={`tabContent${7}`}
          />
          <Tab
            eventKey={8}
            title={<TabTitleText>Board Minutes</TabTitleText>}
            tabContentId={`tabContent${8}`}
          />
          <Tab
            eventKey={9}
            title={<TabTitleText>Latest News</TabTitleText>}
            tabContentId={`tabContent${9}`}
          />
	      </Tabs>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isWidthLimited key="section3">
        <Flex direction={{ default: 'column' }} key="adminTabsMainFlex">
          <FlexItem key="adminTabs">
            <TabContent key={0} eventKey={0} id={`tabContent${0}`} activeKey={activeTabKey} hidden={0 !== activeTabKey}>
	            <AdminCoachTable fetchCoach={fetchCoach} coachData={coachData} setCoachData={setCoachData} coachLoading={coachLoading} setCoachLoading={setCoachLoading} coachErr={coachErr} setCoachErr={setCoachErr} />
            </TabContent>
            <TabContent key={1} eventKey={1} id={`tabContent${1}`} activeKey={activeTabKey} hidden={1 !== activeTabKey}>
	            <AdminPlayersTable fetchPlayers={fetchPlayers} playerData={playerData} setPlayerData={setPlayerData} playerLoading={playerLoading} setPlayerLoading={setPlayerLoading} playerErr={playerErr} setPlayerErr={setPlayerErr} />
            </TabContent>
            <TabContent key={2} eventKey={2} id={`tabContent${2}`} activeKey={activeTabKey} hidden={2 !== activeTabKey}>
              <AdminTeams fetchPlayers={fetchPlayers} playerData={playerData} setPlayerData={setPlayerData} playerLoading={playerLoading} setPlayerLoading={setPlayerLoading} playerErr={playerErr} setPlayerErr={setPlayerErr} fetchCoach={fetchCoach} coachData={coachData} setCoachData={setCoachData} coachLoading={coachLoading} setCoachLoading={setCoachLoading} coachErr={coachErr} setCoachErr={setCoachErr} />
            </TabContent>
            <TabContent key={3} eventKey={3} id={`tabContent${3}`} activeKey={activeTabKey} hidden={3 !== activeTabKey}>
              <AdminFieldsTable />
            </TabContent>
            <TabContent key={4} eventKey={4} id={`tabContent${4}`} activeKey={activeTabKey} hidden={4 !== activeTabKey}>
              <AdminTournamentsTable />
            </TabContent>
            <TabContent key={5} eventKey={5} id={`tabContent${5}`} activeKey={activeTabKey} hidden={5 !== activeTabKey}>
              <AdminLocalitiesTable />
            </TabContent>
            <TabContent key={6} eventKey={6} id={`tabContent${6}`} activeKey={activeTabKey} hidden={6 !== activeTabKey}>
              <AdminBoardMemberTable />
            </TabContent>
            <TabContent key={7} eventKey={7} id={`tabContent${7}`} activeKey={activeTabKey} hidden={7 !== activeTabKey}>
              <AdminBoardMeetingTable />
            </TabContent>
            <TabContent key={8} eventKey={8} id={`tabContent${8}`} activeKey={activeTabKey} hidden={8 !== activeTabKey}>
              <AdminBoardMinutesTable />
            </TabContent>
            <TabContent key={9} eventKey={9} id={`tabContent${9}`} activeKey={activeTabKey} hidden={9 !== activeTabKey}>
              <AdminLatestNewsTable />
            </TabContent>
	        </FlexItem>
	      </Flex>
      </PageSection>
    </div>
  );
}

export default Admin;
//export default withAuthenticationRequired (Admin, {
//    onRedirecting: () => <Loading />,
//});
