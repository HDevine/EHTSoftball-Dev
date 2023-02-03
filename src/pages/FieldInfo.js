import React, { useEffect } from "react";
import {
  Bullseye,
  Card,
  CardFooter,
  CardHeader,
  CardBody,
  EmptyState,
  EmptyStateVariant,
  EmptyStateBody,
  EmptyStateIcon,
  Flex,
  FlexItem,
  Gallery,
  GalleryItem,
  Label,
  Level,
  LevelItem,
  PageSection,
  PageSectionVariants,
  Spinner,
  Tabs,
  Tab,
  TabContent,
  TabContentBody,
  TabTitleText,
  Text,
  Title
} from '@patternfly/react-core';
import { Thead, TableComposable, TableVariant, Tr, Th, Tbody, Td} from '@patternfly/react-table';
import SoftballGoogleMaps from './GoogleMaps';
//import SoftballCalendar from './SoftballCalendar';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import ArrowUpIcon from '@patternfly/react-icons/dist/js/icons/arrow-up-icon';
import ArrowDownIcon from '@patternfly/react-icons/dist/js/icons/arrow-down-icon';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';

const FieldInfo = ({ children }) => {
    const [activeTabKey, setActiveTabKey] = React.useState(0);
    const [fieldData, setFieldData] = React.useState(null);
    const [localityData, setLocalityData] = React.useState(null);
    const [localityLoading, setLocalityLoading] = React.useState(true);
    const [localityErr, setLocalityErr] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [statusColor, setStatusColor] = React.useState("green");
    const [fieldStatus, setFieldStatus] = React.useState("Open");
//    const [count, setCount] = React.useState(0);

    useEffect(() => {
      // Fetch data for Field Status
      fetch("http://softball-pi4/db/GetFields.php")
        .then(async (resp) => {
           const jsonResponse = await resp.json();
           setFieldData(jsonResponse);
           setLoading(false);
        })
        .catch(err => {
          setError(err);
          setLoading(false);
        });
     }, []);
	
     useEffect(() => {
       let count = 0;
     /* Determine the field status and color for presentation */
       if (fieldData?.length > 0) {
         fieldData.map((field) => {
           if (field.fieldStatus === "Closed") {
             count = count + 1;
           }
         });
       }
       if (count > 0 && count < 7) {
        setFieldStatus("Partial");
        setStatusColor("orange");
      }
       if (count === 7) {
        setFieldStatus("Closed");
        setStatusColor("red");
       }
     }, [fieldData]);

     useEffect(() => {
      // Fetch data for Locality locations
      fetch("http://softball-pi4/db/GetLocalities.php")
        .then(async (resp) => {
           const jsonResponse = await resp.json();
           setLocalityData(jsonResponse);
           setLocalityLoading(false);
        })
        .catch(err => {
          setLocalityErr(err);
          setLocalityLoading(false);
        });
     }, []);

    // Toggle currently active tab
    const handleTabClick = (event, tabIndex) => {
      setActiveTabKey(tabIndex);
    };

      return (
      <div>
        <PageSection isWidthLimited variant={PageSectionVariants.light}>
          <Flex
            spaceItems={{ default: 'spaceItemsMd' }}
            alignItems={{ default: 'alignItemsFlexStart' }}
            flexWrap={{ default: 'noWrap' }}
          >
            <FlexItem>
              <Title headingLevel="h1" size="2xl">
                EHT Softball Complex - Field Information
              </Title>
            </FlexItem>
            <FlexItem flex={{ default: 'flexNone' }}>
                <Label color={statusColor}  icon={<CheckCircleIcon />}>{fieldStatus}</Label>
            </FlexItem>
          </Flex>
        </PageSection>
        <PageSection type="tabs" variant={PageSectionVariants.light} isWidthLimited>
          <Tabs activeKey={activeTabKey} onSelect={handleTabClick} usePageInsets id="field-tabs-list">
            <Tab eventKey={0} title={<TabTitleText>Status</TabTitleText>} tabContentId={`tabContent${0}`} />
            <Tab eventKey={1} title={<TabTitleText>Directions</TabTitleText>} tabContentId={`tabContent${1}`} />
            <Tab eventKey={2} title={<TabTitleText>Current Field Schedule</TabTitleText>} tabContentId={`tabContent${2}`} />
          </Tabs>
        </PageSection>
        <PageSection isWidthLimited variant={PageSectionVariants.light}>
          <TabContent key={0} eventKey={0} id={`tabContent${0}`} activeKey={activeTabKey} hidden={0 !== activeTabKey}>
            <TabContentBody>
	            <Level>
	              {loading && (
                  <Bullseye>
                    <Spinner size="xl" />
                  </Bullseye>
                )}
                {!loading && fieldData?.length === 0 && (
                <TableComposable variant={TableVariant.default}  aria-label="Field Info - Localities Table">
                <Tbody>
                  <Tr key="0">
                    <Td colSpan={3}>
                      <Bullseye>
                        <EmptyState variant={EmptyStateVariant.small}>
                          <EmptyStateIcon icon={SearchIcon} />
                          <Title headingLevel="h2" size="lg">
                            No Field Information retrieved!
                          </Title>
                          <EmptyStateBody>
                            Check your network connection or contact the system administrator.
                          </EmptyStateBody>
                        </EmptyState>
                      </Bullseye>
                    </Td>
                  </Tr>
                  </Tbody>
                </TableComposable>
                )}
                {Array.isArray(fieldData) && fieldData.map((field) => (
                <LevelItem key={field.id}>
	                  <Card key={"field"+field.fieldNum}>
                    <CardHeader>Field {field.fieldNum}</CardHeader>
                      {field.fieldStatus === "Open" && (
                      <CardBody>
		                    <ArrowUpIcon color="green" style={{ height: '50px' }} />
			                  Open
                        <Text component="br" />
                        {field.fieldReason}				
                      </CardBody>
                      )}
                      {field.fieldStatus === "Closed" && (
                      <CardBody>
                        <ArrowDownIcon color="red" style={{ height: '50px' }} />
			                  Closed
                        <Text component="br" />
			                  {field.fieldReason}
                      </CardBody>
                      )}
	                  </Card>
                </LevelItem>
		            ))}
	            </Level>
              <Text>{"\n\n\n"}</Text>
	            <Text component="hr" />
	            <Text component="center">
                <img src="/images/eht_fields.png" alt="EHT Field Map" height="500" width="500" />  
	            </Text>
	          </TabContentBody>
          </TabContent>
          <TabContent key={1} eventKey={1} id={`tabContent${1}`} activeKey={activeTabKey} hidden={1 !== activeTabKey}>
            <TabContentBody>
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
              <TableComposable variant={TableVariant.default}  aria-label="Field Info - Localities Table">
                <Tbody>
              {!localityLoading && localityData?.length === 0 && (
                <Tr key="0">
                  <Td colSpan={8}>
                    <Bullseye>
                      <EmptyState variant={EmptyStateVariant.small}>
                        <EmptyStateIcon icon={SearchIcon} />
                        <Title headingLevel="h2" size="lg">
                          No Localities retrieved!
                        </Title>
                        <EmptyStateBody>
                          Check your network connection or contact the system administrator.
                        </EmptyStateBody>
                      </EmptyState>
                    </Bullseye>
                  </Td>
                </Tr>
              )}
              {localityLoading && (
                  <Tr>
                    <Td colSpan={8}>
                      <Bullseye>
                        <Spinner size="xl" />
                      </Bullseye>
                    </Td>
                  </Tr>
                )}
                </Tbody>
              </TableComposable>
              {Array.isArray(localityData) && localityData?.map((locality) => (
                <GalleryItem key={"locality"+locality.id}>
                  <Card key={locality.id}>
	                  <CardHeader>
	                    <Title headingLevel="h1" size="lg">{locality.name}</Title>
	                  </CardHeader>
	                  <CardBody>
                      {locality.street}
                      <Text component="br" />
                      {locality.city}, {locality.state} {locality.zip}
                      <Text component="br" />
	                    <SoftballGoogleMaps lat={locality.lat} lng={locality.lng} />
                      <Text component="br" />
                      <Text component="br" />
                      {locality.description}
	                  </CardBody>
	                  <CardFooter>
	                  </CardFooter>
	                  </Card>
                </GalleryItem>
  	            ))}
              </Gallery>
	          </TabContentBody>
          </TabContent>
          <TabContent key={2} eventKey={2} id={`tabContent${2}`} activeKey={activeTabKey} hidden={2 !== activeTabKey}>
            <TabContentBody>
              Coming soon!
	          </TabContentBody>
          </TabContent>
        </PageSection>
      </div>
    );
}

export default FieldInfo;
