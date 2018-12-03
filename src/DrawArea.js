// @flow
import * as React from 'react';
import Immutable from 'immutable';

import type { List, Map } from 'immutable';

import './DrawArea.css';

type Props = {
  strokeWidth: number,
  color: string,
  getUndoMethod: (() => void) => void, 
  getResetMethod: (() => void) => void,
  svgRef: any,
};

type State = {
  lines: List<List<Map<string, number | string>>>,
  isDrawing: boolean,
};

class DrawArea extends React.Component<Props, State> {
  state = {
    lines: new Immutable.List(),
    isDrawing: false,
  };

  drawArea: { current: any } = React.createRef();

  handleMouseMove = this.handleMouseMove.bind(this);
  handleMouseUp = this.handleMouseUp.bind(this);
  handleMouseDown = this.handleMouseDown.bind(this);

  undo: Function 
  reset: Function

  undo = this.undo.bind(this);
  reset = this.reset.bind(this);

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
      lines: prevState.lines.push(Immutable.List([point])),
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

  relativeCoordinatesForEvent(mouseEvent: any) {
    const { strokeWidth, color } = this.props;
    const boundingRect = this.drawArea.current.getBoundingClientRect();
    return Immutable.Map({
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
          svgRef={this.props.svgRef}
        />
      </div>
    );
  }
}

function Drawing({ lines, onPointerDown, onPointerMove, svgRef }) {
  return (
    <svg
      className="drawing"
      focusable="false"
      tabIndex="0"
      draggable="false"
      touch-action="none" // This was needed to trigger PEP for this element.
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      ref={svgRef}
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
        // $FlowFixMe
        return `${p.get('x')} ${p.get('y')}`;
      })
      .join(" L ");

  // $FlowFixMe
  return <path stroke="black" stroke={line.get(0).get('color')} strokeWidth={line.get(0).get('strokeWidth')}
    fill="none" className="path" d={pathData} />;
}

// $FlowFixMe
export default React.forwardRef((props, ref) => <DrawArea svgRef={ref} {...props} />);