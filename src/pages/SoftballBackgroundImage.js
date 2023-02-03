import React from 'react';
import {
  BackgroundImage
} from '@patternfly/react-core';

class SoftballBackgroundImage extends React.Component {
  constructor(props) {
    super(props);

    this.images = {
      'xs': './softball_background.png',
      'xs2x': './softball_background.png',
      'sm': './softball_background.png',
      'sm2x': './softball_background.png',
      'lg': './softball_background.png',
    };
  }

  render () {
    return <BackgroundImage src={this.images} />;
  }
}

export default SoftballBackgroundImage;
