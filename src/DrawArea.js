import React from 'react';
import Immutable from 'immutable';

import './DrawArea.css';

class DrawArea extends React.Component {
  constructor() {
    super();

    this.state = {
      lines: new Immutable.List(),
      isDrawing: false,
    };

    this.drawArea = React.createRef();

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.undo = this.undo.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.drawArea.current.addEventListener("pointerup", this.handleMouseUp);
    this.props.getUndoMethod(this.undo);
    this.props.getResetMethod(this.reset);
  }

  componentWillUnmount() {
    document.removeEventListener("pointerup", this.handleMouseUp);
  }

  handleMouseDown(mouseEvent) {
    if (mouseEvent.button != 0) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);

    this.setState(prevState => ({
      lines: prevState.lines.push(new Immutable.List([point])),
      isDrawing: true
    }));
  }

  handleMouseMove(mouseEvent) {

    if (!this.state.isDrawing) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);
    this.setState(prevState => ({
      lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
    }));
  }

  handleMouseUp() {
    this.setState({ isDrawing: false });
  }

  relativeCoordinatesForEvent(mouseEvent) {
    const { strokeWidth, color } = this.props;
    const boundingRect = this.drawArea.current.getBoundingClientRect();
    return new Immutable.Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top,
      strokeWidth,
      color,
    });
  }

  undo() {
    this.setState(prevState => {
      return ({
        lines: prevState.lines.delete(prevState.lines.size -1),
      })
    });
  }
  
  reset() {
    this.setState({ lines: new Immutable.List() })
  }

  render() {
    return (
      <div
        className="drawArea"
        ref={this.drawArea}
      >
        <Drawing
          key={2}
          lines={this.state.lines}
          onPointerDown={this.handleMouseDown}
          onPointerMove={this.handleMouseMove}
        />
      </div>
    );
  }
}

function Drawing({ lines, onPointerDown, onPointerMove }) {
  return (
    <svg
      className="drawing"
      focusable="false"
      tabIndex="0"
      draggable="false"
      touch-action="none" // This was needed to trigger PEP for this element.
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
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
    fill="none" className="path" d={pathData} />;
}

export default DrawArea;
