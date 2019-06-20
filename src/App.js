import React from 'react';
import axios from 'axios';
import BootstrapCSSOnly from 'bootstrap-css-only';
import 'font-awesome/css/font-awesome.css';
import './App.scss';
import 'animate.css';
import Author from './Author/Author';
import Hud from './Hud/Hud';
import QuoteText from './QuoteText/QuoteText';
import Footer from './Footer/Footer';
import backgroundsArr from './common/backgrounds';
import animationArr from './common/animations';
import config from './common/config';

let Backgrounds = backgroundsArr;
let Animations = animationArr;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      debugMode: config.defaultState.debugMode,
      autoplay: config.defaultState.autoplay,
      background: 0,
      backgroundImageCredit: String,
      data: [],
      quoteText: String,
      author: String,
      quoteIndex: 0,
      quoteLengthMax: config.defaultState.quoteLengthMax,
      si: null
    };
    this.classesAdd = this.classesAdd.bind(this);
    this.classesRemove = this.classesRemove.bind(this);
    this.handleBackgroundSrcClick = this.handleBackgroundSrcClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.updateAuthor = this.updateAuthor.bind(this);
    this.updateQuoteText = this.updateQuoteText.bind(this);
    this.updateBackground = this.updateBackground.bind(this);
  }
  animateQuote() {
    const index = Math.floor(Math.random() * Animations.length);
    const quote = document.getElementById('text');
    const author = document.getElementById('author');
    // Remove classes ("animated" class & specific animate.css classes)
    this.classesRemove([[quote, 'animated'], [author, 'animated']]);
    for (let i = 0; i <= Animations.length - 1; i++) {
      this.classesRemove([[quote, Animations[i]], [author, Animations[i]]]);
    }
    this.classesAdd([
      [quote, 'animated'],
      [author, 'animated'],
      [quote, Animations[index]],
      [author, Animations[index]]
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
      config.interval.autoplay.si = setInterval(() => {
        this.handleNextClick();
      }, config.interval.autoplay.time);
    } else {
      clearInterval(config.interval.autoplay.si);
    }
    if (debugMode) console.log(autoplay ? 'Autoplay off' : 'Autoplay on');
  }
  handleBackgroundSrcClick() {
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
    this.setState({
      backgroundImageCredit:
        config.backgrounds.credit + Backgrounds[background].credit
    });
    if (debugMode) console.log('Background index: ' + background);
    document.body.style.backgroundImage = `url("${config.backgrounds.src}${
      Backgrounds[background].src
    }")`;
  }
  updateData() {
    if (this.state.debugMode) console.log('Starting GET request');
    axios
      .get(config.api.url)
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
      return encodeURI(
        `https://twitter.com/intent/tweet?text="${quoteText}" — ${author}`
      );
    };
    return (
      <React.Fragment>
        <div
          id="app"
          class="container guidelines col-lg-8 col-md-10 col-sm-12 col-xs-12"
        >
          <div id="quote-box" className="quote-box guidelines container-fluid">
            <Hud
              handleBackgroundSrcClick={this.handleBackgroundSrcClick}
              handleNextClick={this.handleNextClick}
              handlePlayClick={this.handlePlayClick}
              quoteIndex={this.state.quoteIndex}
              twitterLink={formatTwitterUrl()}
            />
            <QuoteText quoteText={this.state.quoteText} />
            <Author author={this.state.author} />
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
