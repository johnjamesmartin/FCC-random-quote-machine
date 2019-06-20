import React from 'react';
import logo from './logo.svg';
import axios from 'axios';
import BootstrapCSSOnly from 'bootstrap-css-only';
import 'font-awesome/css/font-awesome.css';
import './App.scss';
import 'animate.css';

import backgroundsArr from './common/backgrounds';
import animationArr from './common/animations';

/* Config:
 ******************************************/
const Config = {
  api: {
    url: 'https://api.myjson.com/bins/wtpkp'
  },
  backgrounds: {
    src: 'https://i.ibb.co/',
    credit: 'https://bit.ly/'
  },
  interval: {
    autoplay: {
      si: null,
      time: 5000
    }
  }
};

let Backgrounds = backgroundsArr;
let Animations = animationArr;

/* App:
 ******************************************/
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      debugMode: false,
      autoplay: false,
      data: [],
      quoteText: '',
      quoteIndex: 0,
      quoteLengthMax: 100,
      author: '',
      background: 0,
      backgroundImageCredit: '',
      si: null
    };
    this.classesAdd = this.classesAdd.bind(this);
    this.classesRemove = this.classesRemove.bind(this);
    this.handleBgSrcClick = this.handleBgSrcClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.updateAuthor = this.updateAuthor.bind(this);
    this.updateQuoteText = this.updateQuoteText.bind(this);
    this.updateBackground = this.updateBackground.bind(this);
  }
  animateQuote() {
    const quote = document.getElementById('text');
    const author = document.getElementById('author');
    const animIndex = Math.floor(Math.random() * Animations.length);
    this.classesRemove([[quote, 'animated'], [author, 'animated']]);
    for (let i = 0; i <= Animations.length - 1; i++) {
      this.classesRemove([[quote, Animations[i]], [author, Animations[i]]]);
    }
    this.classesAdd([
      [quote, 'animated'],
      [author, 'animated'],
      [quote, Animations[animIndex]],
      [author, Animations[animIndex]]
    ]);
  }
  classesAdd(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i][0].classList.add(arr[i][1]);
    }
  }
  classesRemove(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i][0].classList.remove(arr[i][1]);
    }
  }
  componentDidMount() {
    if (this.state.debugMode) console.log('App mounted');
    this.updateData();
  }
  handleNextClick() {
    if (this.state.debugMode) console.log('Next clicked');
    this.updateQuoteText();
    this.updateBackground();
    this.animateQuote();
  }
  handlePlayClick() {
    const { autoplay, debugMode } = this.state;
    const className = autoplay ? 'play' : 'pause';
    const playPause = document.getElementById('play-pause');
    this.setState({ autoplay: !autoplay });
    playPause.innerHTML = `<i class="fa fa-${className}"></i>`;
    // Autoplay interval
    if (!autoplay) {
      Config.interval.autoplay.si = setInterval(() => {
        this.handleNextClick();
      }, Config.interval.autoplay.time);
    } else {
      clearInterval(Config.interval.autoplay.si);
    }
    if (debugMode) console.log(autoplay ? 'Autoplay off' : 'Autoplay on');
  }
  handleBgSrcClick() {
    if (this.state.debugMode) console.log('Opening background source');
    window.open(this.state.backgroundImageCredit);
  }
  setData(data) {
    const dataShuffled = data
      .filter((element, index, arr) => {
        if (element.quote.length < this.state.quoteLengthMax) {
          return element;
        }
      })
      .sort(() => Math.random() - 0.5);
    this.setState({ data: dataShuffled }, () => {
      this.updateQuoteText();
      this.shuffleBackgrounds();
      this.updateBackground();
    });
  }
  shuffleBackgrounds() {
    if (this.state.debugMode) console.log('Shuffling backgrounds');
    Backgrounds = Backgrounds.sort(() => Math.random() - 0.5);
  }
  updateBackground(src) {
    if (this.state.debugMode) console.log('Updating background');
    const { background, debugMode } = this.state;
    this.setState({
      background: background < Backgrounds.length - 1 ? background + 1 : 0
    });
    this.setState(
      {
        backgroundImageCredit:
          Config.backgrounds.credit + Backgrounds[background].credit
      },
      () => {
        console.log(this.state.backgroundImageCredit);
      }
    );
    if (debugMode) console.log('Background index: ' + background);
    document.body.style.backgroundImage = `url("${Config.backgrounds.src}${
      Backgrounds[background].src
    }")`;
  }
  updateData() {
    if (this.state.debugMode) console.log('Starting GET request');
    axios
      .get(Config.api.url)
      .then(res => {
        this.setData(res.data.quotes);
      })
      .catch(err => {
        if (this.state.debugMode) console.log(err);
      })
      .then(() => {
        if (this.state.debugMode) console.log('Completed request');
      });
  }
  updateQuoteText() {
    if (this.state.debugMode) console.log('Updating quoteText');
    const { data, quoteIndex } = this.state;
    const index = quoteIndex < data.length - 1 ? quoteIndex + 1 : 0;
    this.setState({ quoteIndex: index }, () => {
      this.setState({ quoteText: data[quoteIndex].quote }, () => {
        this.updateAuthor(data[quoteIndex].author);
      });
    });
  }
  updateAuthor(author) {
    this.setState({ author: author });
  }
  render() {
    const formatTwitterUrl = () => {
      const { quoteText, author } = this.state;
      const url = 'https://twitter.com/intent/tweet';
      return encodeURI(`${url}?text="${quoteText}" — ${author}`);
    };
    return (
      <React.Fragment>
        <div
          id="app"
          class="container guidelines col-lg-8 col-md-10 col-sm-12 col-xs-12"
        >
          <div id="quote-box" className="quote-box guidelines container-fluid">
            <Hud
              handleBgSrcClick={this.handleBgSrcClick}
              handleNextClick={this.handleNextClick}
              handlePlayClick={this.handlePlayClick}
              quoteIndex={this.state.quoteIndex}
              twitterLink={formatTwitterUrl()}
            />
            <QuoteText quoteText={this.state.quoteText} />
            <Author author={this.state.author} />
          </div>
        </div>
        <footer>
          By John for <a href="#">FreeCodeCamp</a>
        </footer>
      </React.Fragment>
    );
  }
}

/* Hud (heads up display):
 ******************************************/
class Hud extends React.Component {
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

/* Controls:
 ******************************************/
class Controls extends React.Component {
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

/* Link buttons:
 ******************************************/
class LinkButtons extends React.Component {
  render() {
    return (
      <div className="hud-twitter-btn-wrapper col-md-3 guidelines">
        <a
          className="float-left btn-lg btn-info"
          id="background-src"
          onClick={this.props.handleBgSrcClick}
        >
          <i className="fa fa-image" />
        </a>
        <a
          className="float-left btn-lg btn-primary"
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

/* Quote text:
 ******************************************/
class QuoteText extends React.Component {
  render() {
    const style = () => {
      let fSize = 45;
      switch (true) {
        case this.props.quoteText.length < 40:
          fSize = 50;
          break;
        case this.props.quoteText.length > 0 &&
          this.props.quoteText.length < 50:
          fSize = 50;
          break;
        case this.props.quoteText.length > 50 &&
          this.props.quoteText.length < 70:
          fSize = 45;
          break;
        case this.props.quoteText.length > 70 &&
          this.props.quoteText.length < 90:
          fSize = 40;
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

/* Author:
 ******************************************/
class Author extends React.Component {
  render() {
    return (
      <div id="author" className="author guidelines">
        — {this.props.author}
      </div>
    );
  }
}

export default App;
