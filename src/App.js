import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import words from './words.txt';
import DrawArea from "./DrawArea";
import { CompactPicker } from 'react-color';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.defaultStrokeWidth = 2.5;
    this.defaultColor = 'black';

    this.state = {
      words: [],
      key: 1,
      strokeWidth: this.defaultStrokeWidth,
      color: this.defaultColor,
      downloadLink: '',
    }

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

  download() {
    //get svg element.
    const svg = this.svg.current;

    //get svg source.
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    //add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    //convert svg source to URI data scheme.
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    console.log(url);
    // var file = new Blob([url], { type: 'svg/xml' });
    // var fileURL = URL.createObjectURL(file);
    // var win = window.open();
    // win.document.write('<iframe download="bbdraw.svg" src="' + fileURL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
    //set url value to a element's href attribute.
    this.setState({ downloadLink: url });
  }

  getResetMethod(resetDrawArea) {
    this.reset = () => {
      resetDrawArea();
      this.pickNewWord();
    };

    this.clear = () => resetDrawArea();
  }

  render() {
    const { selectedWord, color, strokeWidth, downloadLink } = this.state;
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
            {selectedWord ? <span><button onClick={() => this.clear()}>Clear</button> Draw: <strong>{selectedWord}</strong> <button onClick={() => this.reset()}><strong>&#x21bb;</strong></button></span> : <Skeleton></Skeleton>}
          </p>
          <CompactPicker color={color} onChangeComplete={color => this.updateColor(color.hex)} />
          <div className="slider">
            <Slider step={this.defaultStrokeWidth} defaultValue={this.defaultStrokeWidth} onChange={value => this.setState({ strokeWidth: value })} />
          </div>
          <p className="App-details">Stroke Width: <strong>{strokeWidth}</strong></p>
          <p>
            <button onClick={() => this.undo()}>Undo</button>
            {' '}
            <button onClick={() => this.download()}>Export</button>
            {' '}
            {downloadLink !== '' && (
              <a download="bbdraw.svg" className="save" target="_blank" href={downloadLink}>Save</a>
            )}
          </p>
        </header>
      </div>
    );
  }
}

export default App;
