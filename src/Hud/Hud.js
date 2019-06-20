import React from 'react';
import { Component } from 'react';
import LinkButtons from '../LinkButtons/LinkButtons';
import Controls from '../Controls/Controls';

class Hud extends Component {
  render() {
    return (
      <div className="hud guidelines row">
        <LinkButtons
          handleBgSrcClick={this.props.handleBgSrcClick}
          twitterLink={this.props.twitterLink}
        />
        <Controls
          handleNextClick={this.props.handleNextClick}
          handlePlayClick={this.props.handlePlayClick}
        />
      </div>
    );
  }
}

export default Hud;
