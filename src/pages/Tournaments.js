import React, { useEffect } from 'react';
import {
  Brand,
  Bullseye,
  Card,
  CardBody,
  CardHeader,
  CardHeaderMain,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Gallery,
  GalleryItem,
  getUniqueId,
  Spinner,
  Text,
  TextContent,
  TextVariants,
  Title,
  TitleSizes
} from '@patternfly/react-core';
import Linkify from 'react-linkify';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';

const Tournaments = ({ children }) => {
  const [tournamentData, setTournamentData] = React.useState(null);
  const [tournamentLoading, setTournamentLoading] = React.useState(true);
  const [tournamentErr, setTournamentErr] = React.useState(null);

  useEffect(() => {
    // Fetch Tournament
    fetch(`http://softball-pi4/db/GetTournaments.php`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setTournamentData(jsonResponse);
      setTournamentLoading(false);
    })
    .catch(err => {
      setTournamentErr(err);
      setTournamentLoading(false);
    })
  }, []);

  return (
    <div>
      <React.Fragment>
        <Title headingLevel="h1" size={TitleSizes['4xl']}>{(new Date().getFullYear())} Tournament Schedule</Title>
        <Gallery 
          hasGutter
          minWidths={{
            default: '100%',
            md: '100px',
            xl: '500px'
          }}
          maxWidths={{
            md: '750px',
            xl: '1fr'
          }}              
        >
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
          <GalleryItem key={"gallery-"+getUniqueId()}>
          <Card isSelectable key={"tourney-"+getUniqueId()}>
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
                <Linkify>
                  Register at <a href={row.registerURL} target="_blank" rel="noreferrer">{row.registerURL}</a>
                </Linkify>
                <Text component={TextVariants.h6}>{row.description}</Text>
	            </TextContent>
	          </CardBody>
	        </Card>
          </GalleryItem>
        ))}
        </Gallery>
        </React.Fragment>
      </div>
    );
}

export default Tournaments;

