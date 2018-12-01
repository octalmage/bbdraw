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

  render() {
    const { selectedWord } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>BB Draw</h1>
          <DrawArea></DrawArea>
          <p>{selectedWord ? <span>Draw: <strong>{selectedWord}</strong></span> : <Skeleton></Skeleton>}</p>
        </header>
      </div>
    );
  }
}

export default App;
