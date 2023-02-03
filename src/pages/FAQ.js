import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionToggle,
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  Title
} from '@patternfly/react-core';

class FAQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: ['faq-toggle1']
    };
  }
 
  render() {
    const toggle = id => {
      const expanded = this.state.expanded;
      const index = expanded.indexOf(id);
      const newExpanded =
        index >= 0 ? [...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length)] : [...expanded, id];
      this.setState(() => ({ expanded: newExpanded }));
    };

    return (
      <div>
        <PageSection variant={PageSectionVariants.light} isWidthLimited>
          <Flex
            spaceItems={{ default: 'spaceItemsMd' }}
            alignItems={{ default: 'alignItemsFlexStart' }}
            flexWrap={{ default: 'noWrap' }}
          >
            <FlexItem>
              <Title headingLevel="h1" size="2x1">
                EHT Softball - Frequently Asked Questions (FAQ)
              </Title>
              <Text component="hr" />
              <Text component="br" />
              <Text component="br" />
              <TextContent>
                <Text>This page should be able to answer any frequently asked questions that you have about the online
                  registration page.  If you still need assistance after reading through these FAQ's, please contact us
                  at <a href="mailto:ehtsoftball@aol.com" target="_self">ehtsoftball@aol.com</a>.
                </Text>
              </TextContent>
            </FlexItem>
          </Flex>
        </PageSection>
        <PageSection variant={PageSectionVariants.light} isWidthLimited>
          <Accordion asDefinitionList={false} displaySize={"large"} headingLevel={"h6"}>
            <AccordionItem>
              <AccordionToggle
                onClick={() => toggle('faq-toggle1')}
                isExpanded={this.state.expanded.includes('faq-toggle1')}
                id="faq-toggle1"
              >
                1) Can my daughter play in a division higher than her age?
              </AccordionToggle>
              <AccordionContent id="faq-expand1" isHidden={!this.state.expanded.includes('faq-toggle1')} isFixed>
                <p>
                  Yes, but for safety reasons and in the interest in balancing our recreational league teams she will have to be evaluated by our coaching staff and a waiver will need to be signed by the parents or legal guardian.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionToggle
                onClick={() => toggle('faq-toggle2')}
                isExpanded={this.state.expanded.includes('faq-toggle2')}
                id="faq-toggle2"
              >
                2) Can I register more than 1 child?
              </AccordionToggle>
              <AccordionContent id="faq-expand2" isHidden={!this.state.expanded.includes('faq-toggle2')} isFixed>
                <p>
                  Yes, you can register more than one child, and in the spring discounts are offered for the 2nd and 3rd child.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionToggle
                onClick={() => toggle('faq-toggle3')}
                isExpanded={this.state.expanded.includes('faq-toggle3')}
                id="faq-toggle3"
              >
                3) Can my daughter play with her friend?                 
              </AccordionToggle>
              <AccordionContent id="faq-expand3" isHidden={!this.state.expanded.includes('faq-toggle3')} isFixed>
                <p>
                  There is a spot on the registration where you can request to play with another teammate. We do everything that we can to accommodate these requests, but there aren't any guarantees that your request will be granted.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionToggle
                onClick={() => toggle('faq-toggle4')}
                isExpanded={this.state.expanded.includes('faq-toggle4')}
                id="faq-toggle4"
              >
                4) Do I have to work the snack stand?
              </AccordionToggle>
              <AccordionContent id="faq-expand4" isHidden={!this.state.expanded.includes('faq-toggle4')} isFixed>
                <p>
                  <b>ALL TEAMS</b> are required to work the snack stand. In the Spring season an additional refundable fee will be added to your registration. When you fulfill your duty as a volunteer on your team's scheduled evening your fee will be reimbursed.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionToggle
                onClick={() => toggle('faq-toggle5')}
                isExpanded={this.state.expanded.includes('faq-toggle5')}
                id="faq-toggle5"
              >
                5) Do you offer payment plan options? 
              </AccordionToggle>
              <AccordionContent id="faq-expand5" isHidden={!this.state.expanded.includes('faq-toggle5')} isFixed>
                <p>
                  With our new online system we can offer payment plan options at the discretion of our executive board members. Please contact Christine Culligan for more information.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionToggle
                onClick={() => toggle('faq-toggle6')}
                isExpanded={this.state.expanded.includes('faq-toggle6')}
                id="faq-toggle6"
              >
                6) Can I play only travel ball and not recreational ball? 
              </AccordionToggle>
              <AccordionContent id="faq-expand6" isHidden={!this.state.expanded.includes('faq-toggle6')} isFixed>
                <p>
                  No. In order to play on our XTreme travel team or on our All-Star Team, which are both try-out based programs, you need to play recreational softball, and there are a qualifying number of games that you must play for All-Stars.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionToggle
                onClick={() => toggle('faq-toggle7')}
                isExpanded={this.state.expanded.includes('faq-toggle7')}
                id="faq-toggle7"
              >
                7) Can anyone play All-Stars? 
              </AccordionToggle>
              <AccordionContent id="faq-expand7" isHidden={!this.state.expanded.includes('faq-toggle7')} isFixed>
                <p>
                  Every girl who has played at least 7 games in our recreational softball league (half of the regular season) is eligible to try out for the All-Star team, keeping in mind that each level is permitted to roster only as many as 15 players.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionToggle
                onClick={() => toggle('faq-toggle8')}
                isExpanded={this.state.expanded.includes('faq-toggle8')}
                id="faq-toggle8"
              >
                8) Can my daughter play for 2 teams at the same time? 
              </AccordionToggle>
              <AccordionContent id="faq-expand8" isHidden={!this.state.expanded.includes('faq-toggle8')} isFixed>
                <p>
                  Yes. Your child can dual roster for a team according to her age level, and also play up one level. However, she must declare for which team she will play in the post-season playoffs, and in order to qualify for playoffs at either level, she will have to have 10 games in at that level. Alternatively, if she would like to play All-Stars for one of the 2 levels she will have to have 7 games in at that level for which she wants to try out.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionToggle
                onClick={() => toggle('faq-toggle9')}
                isExpanded={this.state.expanded.includes('faq-toggle9')}
                id="faq-toggle9"
              >
                9) What happens if we need to go on vacation?
              </AccordionToggle>
              <AccordionContent id="faq-expand9" isHidden={!this.state.expanded.includes('faq-toggle9')} isFixed>
                <p>
                  In recreational ball everyone plays. If you miss practices your child will still get play time. However, you must keep in mind your team members, the coaches, and the other families who paid like you to watch their kids play softball, not forfeit games due to a lack of players. In competitive leagues such as with the All-Star and XTreme teams this is much less acceptable, because they cannot pull players from other teams to fill their rosters. You are encouraged to please schedule vacations around your game schedule whenever possible.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionToggle
                onClick={() => toggle('faq-toggle10')}
                isExpanded={this.state.expanded.includes('faq-toggle10')}
                id="faq-toggle10"
              >
                10) Do you have a Hardship Program?
              </AccordionToggle>
              <AccordionContent id="faq-expand10" isHidden={!this.state.expanded.includes('faq-toggle10')} isFixed>
                <p>
                  Yes. We do offer hardship, but again this is at the discretion of the members of the board, and you will be asked to provide sensitive information to assure that you qualify for such a program.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageSection>
      </div>
    );
  }
}

export default FAQ;

