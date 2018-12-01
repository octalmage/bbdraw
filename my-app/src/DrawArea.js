import React from 'react';
import Immutable from 'immutable';
import Pressure from 'pressure';

import './DrawArea.css';

class DrawArea extends React.Component {
    constructor() {
      super();

      this.defaultStrokeWidth = 2;
      this.defaultColor = "blue";
  
      this.state = {
        lines: new Immutable.List(),
        isDrawing: false,
        strokeWidth: this.defaultStrokeWidth,
        color: this.defaultColor,
      };

  

      this.drawArea = React.createRef();

      console.log(this.drawArea);
  
      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
    }
  
    componentDidMount() {

      Pressure.set(this.drawArea.current, {
        change: (force, event) => {
          // console.log(force, event);
          // this.handleMouseMove(event);
        },
        // start: this.handleMouseDown,
        // end: this.handleMouseUp,
      });

      document.addEventListener("pointerup", this.handleMouseUp);
    }
  
    componentWillUnmount() {
      document.removeEventListener("pointerup", this.handleMouseUp);
    }
  
    handleMouseDown(mouseEvent) {
      console.log('start');
      // mouseEvent.preventDefault();
      // if (mouseEvent.button != 0) {
      //   return;
      // }
  
      const point = this.relativeCoordinatesForEvent(mouseEvent);
  
      this.setState(prevState =>  ({
        lines: prevState.lines.push(new Immutable.List([point])),
        isDrawing: true
      }));
    }
  
    handleMouseMove(mouseEvent) {
 
      if (!this.state.isDrawing) {
        return;
      }
  
      const point = this.relativeCoordinatesForEvent(mouseEvent);
      console.log(point.toJS());
      this.setState(prevState => console.log(prevState.lines.toJS()) || ({
        lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
      }));
    }
  
    handleMouseUp() {
      console.log('end');
      this.setState({ isDrawing: false });
    }
  
    relativeCoordinatesForEvent(mouseEvent) {
      const { strokeWidth, color } = this.state;
      const boundingRect = this.drawArea.current.getBoundingClientRect();
      return new Immutable.Map({
        x: mouseEvent.clientX - boundingRect.left,
        y: mouseEvent.clientY - boundingRect.top,
        strokeWidth,
        color,
      });
    }
  
    render() {
      return (
        <div
          className="drawArea"
          ref={this.drawArea}
          onPointerDown={this.handleMouseDown}
          onPointerMove={this.handleMouseMove}
        >
          <Drawing key={2} lines={this.state.lines} />
        </div>
      );
    }
  }
  
  function Drawing({ lines }) {
    return (
      <svg className="drawing">
        {lines.map((line, index) => (
          <DrawingLine key={index} line={line} />
        ))}
      </svg>
    );
  }
  
  function DrawingLine({ line }) {
    const pathData = "M " +
      line
        .map(p => {
          return `${p.get('x')} ${p.get('y')}`;
        })
        .join(" L ");
  
    return <path stroke="black" stroke={line.get(0).get('color')} strokeWidth={line.get(0).get('strokeWidth')}
    fill="none"  className="path" d={pathData} />;
  }
  
export default DrawArea;
  