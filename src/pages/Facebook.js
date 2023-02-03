import React, { Component } from 'react';
import { FacebookProvider, Like } from 'react-facebook';

export default class SoftballFacebook extends Component {
  render() {
    return (
      <FacebookProvider appId="454219372978279">
        <Like href="http://www.facebook.com" colorScheme="light" showFaces share />
      </FacebookProvider>
    );
  }
}
