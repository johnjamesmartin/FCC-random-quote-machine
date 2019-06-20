import React from 'react';
import { Component } from 'react';

class Author extends Component {
  render() {
    return (
      <div id="author" className="author guidelines">
        — {this.props.author}
      </div>
    );
  }
}

export default Author;
