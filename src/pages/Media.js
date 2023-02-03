import React from 'react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import images from '../images';

class Media extends React.Component {

  render() {
    return <ImageGallery items={images} thumbnailPosition="left" />;
  }
}

export default Media;

