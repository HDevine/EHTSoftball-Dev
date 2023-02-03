import React, { useEffect } from 'react';
import {
  Banner,
  Brand,
  Bullseye,
  Card,
  CardBody,
  CardHeader,
  CardHeaderMain,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Spinner,
  Text,
  TextContent,
  TextVariants,
  Title
} from '@patternfly/react-core';
import Linkify from 'linkify-react';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';

const Dashboard = ({ children }) => {
  const [mtgData, setMtgData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);
  const [tournamentData, setTournamentData] = React.useState(null);
  const [tournamentLoading, setTournamentLoading] = React.useState(true);
  const [tournamentErr, setTournamentErr] = React.useState(null);
  const [newsData, setNewsData] = React.useState(null);
  const [newsLoading, setNewsLoading] = React.useState(true);
  const [newsErr, setNewsErr] = React.useState(null);

  useEffect(() => {
    // Fetch data for Latest News
//      fetch(`https://softball-pi4/db/GetLatestNews.php`)
    fetch(`http://softball-pi4/db/GetLatestNews.php`)
//    fetch(`https://harrydevine.org/db/GetLatestNews.php`)
    .then(async resp => { 
        const response = await resp.json();
        setNewsData(response);
        setNewsLoading(false);
      })
      }, []);

  useEffect(() => {
    // Fetch data for next Board Meeting
//    fetch(`https://softball-pi4/db/GetNextBoardMeeting.php`)
    fetch(`http://softball-pi4/db/GetNextBoardMeeting.php`)
//    fetch(`https://harrydevine.org/db/GetNextBoardMeeting.php`)
    .then(async resp => {
      const response = await resp.json();
      setMtgData(response);
      setLoading(false);
    })
    .catch(err => {
      setErr(err);
      setLoading(false);
    })
  }, []);
    
  useEffect(() => {
    // Fetch data for next Tournament
//    fetch(`https://softball-pi4/db/GetNextTournament.php`)
    fetch(`http://softball-pi4/db/GetNextTournament.php`)
//    fetch(`https://harrydevine.org/db/GetNextTournament.php`)
    .then(async resp => {
      const response = await resp.json();
      setTournamentData(response);
      setTournamentLoading(false);
    })
    .catch(err => {
      setTournamentErr(err);
      setTournamentLoading(false);
    })
  }, []);
      
    return (
      <div>
	      <Banner variant="info">Latest News</Banner>
        {newsLoading && (
  		    <Bullseye>
	  	      <Spinner size="xl" />
		      </Bullseye>
        )}
        {!newsLoading && newsData?.length === 0 && (
          <Bullseye>
            <EmptyState variant={EmptyStateVariant.small}>
              <EmptyStateIcon icon={SearchIcon} />
                <Title headingLevel="h2" size="lg">
                  No Latest News information retrieved!
                </Title>
              <EmptyStateBody>
                Check your network connection or contact the system administrator.
              </EmptyStateBody>
            </EmptyState>
          </Bullseye>
        )}
        {!newsLoading && newsData?.map(row => (
        <Card isSelectable key={row.id}>
          <CardTitle><u>{row.title}</u></CardTitle>
          <CardBody>
            <Linkify tagName="p" options={{ target: "_blank" }}>
              {row.body}
            </Linkify>
            <Linkify>
              <img src={row.image}/>
            </Linkify>
          </CardBody>
        </Card>
        ))}
	      <Banner variant="success">Upcoming Tournaments</Banner>
        {tournamentLoading && (
  		    <Bullseye>
	  	      <Spinner size="xl" />
		      </Bullseye>
        )}
        {!tournamentLoading && tournamentData?.length === 0 && (
          <Bullseye>
            <EmptyState variant={EmptyStateVariant.small}>
              <EmptyStateIcon icon={SearchIcon} />
                <Title headingLevel="h2" size="lg">
                  No Tournament information retrieved!
                </Title>
              <EmptyStateBody>
                Check your network connection or contact the system administrator.
              </EmptyStateBody>
            </EmptyState>
          </Bullseye>
        )}
        {!tournamentLoading && tournamentData?.map(row => (
          <Card isSelectable key="next_tournament_card">
	          <CardHeader>
	            <CardHeaderMain>
	              <Brand src={row.tourneyImg} alt="Tournament Image" style={{ height: '150px' }} />
	            </CardHeaderMain>
	          </CardHeader>
	          <CardBody>
	            <TextContent>
	              <Text component={TextVariants.h6}>{row.title}</Text>
                <Text component={TextVariants.h6}>Date: {row.dateStart} until {row.dateEnd}</Text>
                <Text component={TextVariants.h6}>Location: 31 Idlewood Ave, Egg Harbor Township NJ 08234</Text>
                <Text component={TextVariants.h6}>Divisions: {row.divisions}</Text>
                <Text component={TextVariants.h6}>{row.details}</Text>
                <Linkify tagName="p" options={{ target: "_blank" }} >
                  Register at {row.registerURL}
                </Linkify>
                <Text component={TextVariants.h6}>{row.description}</Text>
	            </TextContent>
	          </CardBody>
	        </Card>
        ))}
        <Banner variant="info">Board Meetings</Banner>
         {loading && (
  		     <Bullseye>
	  	       <Spinner size="xl" />
		       </Bullseye>
         )}
         {!loading && mtgData?.length === 0 && (
           <Bullseye>
             <EmptyState variant={EmptyStateVariant.small}>
               <EmptyStateIcon icon={SearchIcon} />
                 <Title headingLevel="h2" size="lg">
                   No Board Meeting information retrieved!
                 </Title>
                <EmptyStateBody>
                  Check your network connection or contact the system administrator.
                </EmptyStateBody>
             </EmptyState>
           </Bullseye>
         )}
         {!loading && mtgData?.map(row => (
	         <Card isSelectable key="next_meeting_card">
             <CardTitle><u>Next Board Meeting</u></CardTitle>
               <CardBody>Date: {row.date} </CardBody>
               <CardBody>Time: {row.time} </CardBody>
               <CardBody>Location: EHT Softball Complex, 31 Idlewood Ave, Egg Harbor Twp NJ 08234 </CardBody>	    
	          </Card>
         ))}
         <Banner>Who we are</Banner>
           <Card isSelectable key="who_we_are_card">
             <CardBody>
               Egg Harbor Township Youth Softball is proud of it's 6-16U EHT Tornadoes Recreational League. EHT has a long heritage of championship recreational Babe Ruth All-Star teams, winning numerous titles at all age levels. EHT Youth Softball is open to all EHT girls from ages 5-17. You must be a resident of EHT to join our recreation program.  A regular season schedule is played week nights from April through June culminating in an ABRSL league Championship. From June through July, the All-star teams play in District, State, and Regional tournaments leading up to the Babe Ruth World Series.<br /><br />
From September through November, EHTYS hosts a Fall softball league, where all games are played here at the Child's Kirk Memorial Park in EHT on Sundays. This is the perfect opportunity to take advantage for next level preparation, or simply to stay on top of your game for the next spring season. There are no standings kept, no playoffs, and no pressure. It's also the best time to introduce any new player to the wonderful game of softball!
             </CardBody>
            </Card>
    </div>
  );
}

export default Dashboard;

