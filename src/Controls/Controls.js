import React from 'react';
import { Component } from 'react';

class Controls extends Component {
  render() {
    return (
      <div className="col-md-9 guidelines">
        <button
          className="float-right btn btn-lg btn-dark"
          id="new-quote"
          onClick={this.props.handleNextClick}
        >
          Next <i className="fa fa-random" />
        </button>
        <button
          className="float-right btn btn-lg btn-dark"
          id="play-pause"
          onClick={this.props.handlePlayClick}
        >
          <i className="fa fa-play" />
        </button>
      </div>
    );
  }
}

export default Controls;
