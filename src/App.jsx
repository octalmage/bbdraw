import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import { CirclePicker } from 'react-color';
import Slider from 'rc-slider';
import words from './words.txt';
import DrawArea from './DrawArea';
import 'rc-slider/assets/index.css';
import './App.css';

const colors = [
  '#ffffff',
  '#555555',
  '#f44336',
  '#FF44ff',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#000000',
];

class App extends Component {
  constructor(props) {
    super(props);

    this.defaultStrokeWidth = 2.5;
    this.defaultColor = 'black';

    this.state = {
      words: [], // eslint-disable-line
      // key: 1,
      strokeWidth: this.defaultStrokeWidth,
      color: this.defaultColor,
      downloadLink: '',
      wordShowing: true,
    };

    this.svg = React.createRef();

    this.pickNewWord = this.pickNewWord.bind(this);
    this.updateColor = this.updateColor.bind(this);
    this.getUndoMethod = this.getUndoMethod.bind(this);
    this.getResetMethod = this.getResetMethod.bind(this);
    this.download = this.download.bind(this);

    this.drawArea = React.createRef();
  }

  componentDidMount() {
    fetch(words).then(data => data.text())
      .then((text) => {
        this.setState(
          {
            words: text.split('\n'), // eslint-disable-line
          },
          () => this.pickNewWord(),
        );
      });
  }

  getUndoMethod(method) {
    this.undo = method;
  }

  getResetMethod(resetDrawArea) {
    this.reset = () => {
      resetDrawArea();
      this.pickNewWord();
    };

    this.clear = () => resetDrawArea();
  }

  download() {
    // get svg element.
    const svg = this.svg.current;

    // get svg source.
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    // add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    // add xml declaration
    source = `<?xml version="1.0" standalone="no"?>\r\n${source}`;

    // convert svg source to URI data scheme.
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;

    // var file = new Blob([url], { type: 'svg/xml' });
    // var fileURL = URL.createObjectURL(file);
    // var win = window.open();
    // win.document.write('<iframe download="bbdraw.svg" src="' + fileURL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
    // set url value to a element's href attribute.
    this.setState({ downloadLink: url });
  }

  updateColor(color) {
    this.setState({ color });
  }

  pickNewWord() {
    this.setState(({ words: wordList }) => ({
      selectedWord: wordList[Math.floor(Math.random() * wordList.length)],
    }));
  }

  render() {
    const {
      selectedWord, 
      color, 
      strokeWidth, 
      downloadLink,
      wordShowing,
    } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>BB Draw</h1>
          <div ref={this.drawArea}>
            <DrawArea
              ref={this.svg}
              color={color}
              strokeWidth={strokeWidth}
              getUndoMethod={this.getUndoMethod}
              getResetMethod={this.getResetMethod}
            />
          </div>
          <p>
            {selectedWord ? (
              <span>
                <button type="button" onClick={() => this.clear()}>Clear</button>
                {' '}
                Draw:
                {' '}
                <strong onClick={() => this.setState((state) => ({ wordShowing: !state.wordShowing }))}>{wordShowing ? selectedWord : 'HIDDEN'}</strong>
                {' '}
                <button onClick={() => this.reset()}><strong>&#x21bb;</strong></button>
              </span>
            ) : <Skeleton />}
          </p>
          <div>
            <CirclePicker
              colors={colors}
              className="circle"
              color={color}
              onChangeComplete={newColor => this.updateColor(newColor.hex)}
            />
          </div>
          <div className="slider">
            <Slider step={this.defaultStrokeWidth} defaultValue={this.defaultStrokeWidth} onChange={value => this.setState({ strokeWidth: value })} />
          </div>
          <p className="App-details">
Stroke Width:
            <strong>{strokeWidth}</strong>
          </p>
          <p>
            <button type="button" onClick={() => this.undo()}>Undo</button>
            {' '}
            <button type="button" onClick={() => this.download()}>Export</button>
            {' '}
            {downloadLink !== '' && (
              <a download="bbdraw.svg" rel="noopener noreferrer" className="save" target="_blank" href={downloadLink}>Save</a>
            )}
          </p>
        </header>
      </div>
    );
  }
}

export default App;
