import React from 'react';
import { Component } from 'react';

class QuoteText extends React.Component {
  render() {
    const style = () => {
      let fSize = 55;
      switch (true) {
        case this.props.quoteText.length < 40:
          fSize = 55;
          break;
        case this.props.quoteText.length > 0 &&
          this.props.quoteText.length < 50:
          fSize = 55;
          break;
        case this.props.quoteText.length > 50 &&
          this.props.quoteText.length < 70:
          fSize = 50;
          break;
        case this.props.quoteText.length > 70 &&
          this.props.quoteText.length < 90:
          fSize = 45;
          break;
        case this.props.quoteText.length > 90 &&
          this.props.quoteText.length < 120:
          fSize = 32;
          break;
        case this.props.quoteText.length > 120:
          fSize = 26;
          break;
      }
      return { fontSize: fSize };
    };
    return (
      <div className="quote guidelines" id="text" style={style()}>
        <i className="fa fa-quote-left" /> <span>{this.props.quoteText}</span>
      </div>
    );
  }
}
export default QuoteText;
