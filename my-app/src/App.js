import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import words from './words.txt';
import DrawArea from "./DrawArea";
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      words: [],
      key: 1,
    }

    this.pickNewWord = this.pickNewWord.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);

    this.drawArea = React.createRef();
  }

  componentDidMount() {
    fetch(words).then(data => data.text())
      .then(text => {
        this.setState(
          { 
            words: text.split("\n") 
          }, 
          () => this.pickNewWord(),
        )
      });
  }

  pickNewWord() {
    this.setState(({ words }) => ({
      selectedWord: words[Math.floor(Math.random() * words.length)],
    }));
  
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
        this.launchIntoFullscreen(this.drawArea.current);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen(); 
      }
    }
  }

 launchIntoFullscreen(element) {
    if(element.requestFullscreen) {
      element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  render() {
    const { selectedWord } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>BB Draw</h1>
          <div ref={this.drawArea}><DrawArea></DrawArea></div>
          <p>{selectedWord ? <span>Draw: <strong>{selectedWord}</strong></span> : <Skeleton></Skeleton>}</p>
          <button onClick={this.toggleFullScreen}>Toggle Fullscreen</button>
        </header>
      </div>
    );
  }
}

export default App;
