import React from 'react';
import { Component } from 'react';

class LinkButtons extends Component {
  render() {
    return (
      <div className="hud-twitter-btn-wrapper col-md-3 guidelines">
        <a
          className="float-left btn btn-info"
          id="background-src"
          onClick={this.props.handleBgSrcClick}
        >
          <i className="fa fa-image" />
        </a>
        <a
          className="float-left btn btn-primary"
          id="tweet-quote"
          href={this.props.twitterLink}
          target="_blank"
        >
          <i className="fa fa-twitter" />
        </a>
      </div>
    );
  }
}

export default LinkButtons;
