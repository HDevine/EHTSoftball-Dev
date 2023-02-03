import React from 'react';
import {
  Gallery,
  GalleryItem,
  Title,
  TitleSizes
} from '@patternfly/react-core';

class Sponsors extends React.Component {

  render() {
    return (
      <div>
        <React.Fragment>
          <Title headingLevel="h1" size={TitleSizes['4xl']}>Thank you to our amazing sponsors!</Title>
          <Gallery gutter='lg'>
           <GalleryItem><img src='/images/Sponsors.png' alt='Host-Collections-Intl' /></GalleryItem>
           <GalleryItem><img src='/images/knm.png' alt='K&M Auto' /></GalleryItem>
           <GalleryItem><img src='/images/dicks.png' alt='Dicks Sporting Goods' /></GalleryItem>
           <GalleryItem><img src='/images/relieveus.png' alt='RelievUS' /></GalleryItem>
           <GalleryItem><img src='/images/bennett.png' alt='Bennett Chevrolet' /></GalleryItem>
           <GalleryItem><img src='/images/square.png' alt='Square' /></GalleryItem>
           <GalleryItem><img src='/images/ortho.png' alt='Finkelson Orthodontics' /></GalleryItem>
           <GalleryItem><img src='/images/gem.png' alt='Gem Travel' /></GalleryItem>
           <GalleryItem><img src='/images/braes.png' alt='Brayces' /></GalleryItem>
           <GalleryItem><img src='/images/casa.png' alt='Casa Payroll' /></GalleryItem>
           <GalleryItem><img src='/images/jule.png' alt='Jule D Photography' /></GalleryItem>
           <GalleryItem><img src='/images/casaldis.png' alt='Casaldis Cucina' /></GalleryItem>
           <GalleryItem><img src='/images/primo.png' alt='Primo Pizza' /></GalleryItem>
           <GalleryItem><img src='/images/dw.png' alt='DW' /></GalleryItem>
           <GalleryItem><img src='/images/batting.png' alt='The Batting Zone' /></GalleryItem>
           <GalleryItem><img src='/images/chapman.jpg' alt='Chapman Ford' /></GalleryItem>
           <GalleryItem><img src='/images/shoreortho.png' alt='Shore Orthodontics' /></GalleryItem>
           <GalleryItem><img src='/images/shore.png' alt='Shore Orthopedics' /></GalleryItem>
           <GalleryItem><img src='/images/jafconstruction.jpg' alt='JAF Construction' /></GalleryItem>
           <GalleryItem><img src='/images/jillyscorn.png' alt='Jillys Cracked Corn' /></GalleryItem>
          </Gallery>
        </React.Fragment>
      </div>
    );
  }
}

export default Sponsors;

