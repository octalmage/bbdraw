import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import words from './words.txt';
import DrawArea from "./DrawArea";
import { CompactPicker } from 'react-color';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.defaultStrokeWidth = 2;
    this.defaultColor = 'black';

    this.state = {
      words: [],
      key: 1,
      strokeWidth: this.defaultStrokeWidth,
      color: this.defaultColor,
    }

    this.pickNewWord = this.pickNewWord.bind(this);
    this.updateColor = this.updateColor.bind(this);
    this.getUndoMethod = this.getUndoMethod.bind(this);

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

  updateColor(color) {
    this.setState({ color });
  }

  getUndoMethod(method) {
    this.undo = method;
  }

  render() {
    const { selectedWord, color, strokeWidth } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>BB Draw</h1>
          <div ref={this.drawArea}>
            <DrawArea
              color={color}
              strokeWidth={strokeWidth}
              getUndoMethod={this.getUndoMethod}
            />
          </div>
          <p>{selectedWord ? <span>Draw: <strong>{selectedWord}</strong></span> : <Skeleton></Skeleton>}</p>
          {/* <button onClick={() => this.updateColor('red')}>Red</button>
          <button onClick={() => this.updateColor('blue')}>Blue</button>
          <button onClick={() => this.updateColor('black')}>Black</button>
          <button onClick={() => this.updateColor('green')}>Green</button>
          <button onClick={() => this.updateColor('yellow')}>Yellow</button>
          <button onClick={() => this.updateColor('white')}>White</button> */}
          <CompactPicker color={color} onChangeComplete={color => this.updateColor(color.hex)} />
          <p>
            <button
              onClick={
                () => this.setState(prevProps => ({ strokeWidth: prevProps.strokeWidth - 1 }))
              }
            >
              Minus
          </button>
          <button
              onClick={
                () => this.setState(prevProps => ({ strokeWidth: prevProps.strokeWidth + 1 }))
              }
            >
              Plus
          </button>
          </p>
          <p className="App-details">Stroke Width: <strong>{strokeWidth}</strong></p>
          <p><button onClick={() => this.undo()}>Undo</button></p>
        </header>
      </div>
    );
  }
}

export default App;
