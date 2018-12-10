// @flow
import * as React from 'react';
import Immutable, { fromJS, isKeyed } from 'immutable';

import type { List, Map } from 'immutable';

import './DrawArea.css';

type Props = {
  strokeWidth: number,
  color: string,
  getUndoMethod: (() => void) => void,
  getResetMethod: (() => void) => void,
  svgRef: any,
};

type Line = List<Map<string, number | string>>;
type Lines = List<Line>;

type State = {
  lines: Lines,
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

  hydrateStateWithLocalStorage = this.hydrateStateWithLocalStorage.bind(this);

  componentDidUpdate = this.componentDidUpdate.bind(this);

  storeStateInLocalStorage = this.storeStateInLocalStorage.bind(this);

  undo: Function // eslint-disable-line

  reset: Function

  undo = this.undo.bind(this);

  reset = this.reset.bind(this);

  componentDidMount() {
    const { getUndoMethod, getResetMethod } = this.props;
    this.drawArea.current.addEventListener('pointerup', this.handleMouseUp);
    getUndoMethod(this.undo);
    getResetMethod(this.reset);

    this.hydrateStateWithLocalStorage();
  }

  componentDidUpdate() {
    this.storeStateInLocalStorage();
  }

  storeStateInLocalStorage() {
    // for all items in state
    Object.keys(this.state).forEach((key) => {
      localStorage.setItem(key, JSON.stringify(this.state[key])); // eslint-disable-line
    });
  }

  hydrateStateWithLocalStorage() {
    // for all items in state
    for (let key in this.state) { // eslint-disable-line
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);
        if (typeof value === 'string') {
          // console.log(key, value);
          // parse the localStorage string and setState
          try {
            value = JSON.parse(value);
            const l = fromJS(value);
            this.setState({ [key]: l });
          } catch (e) {
            // handle empty string
            // this.setState({ [key]: value });
          }
        }
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('pointerup', this.handleMouseUp);
  }

  handleMouseDown(mouseEvent) {
    if (mouseEvent.button != 0) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);

    this.setState(prevState => ({
      lines: prevState.lines.push(Immutable.List([point])),
      isDrawing: true,
    }));
  }

  handleMouseMove(mouseEvent) {
    const { isDrawing } = this.state;
    if (!isDrawing) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);
    this.setState(prevState => ({
      lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point)),
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
    this.setState(prevState => ({
      lines: prevState.lines.delete(prevState.lines.size - 1),
    }));
  }

  reset() {
    this.setState({ lines: new Immutable.List() });
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

type DrawingProps = {
  lines: Lines,
  onPointerDown: Function,
  onPointerMove: Function,
  svgRef: any,
}
function Drawing({
  lines,
  onPointerDown,
  onPointerMove,
  svgRef,
}: DrawingProps) {
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

type DrawingLineProps = {
  line: Line,
};

function DrawingLine({ line }: DrawingLineProps) {
  const pathData = 'M '
    + line
      .map((p) =>
        // $FlowFixMe
         `${p.get('x')} ${p.get('y')}`
      )
      .join(' L ');

  // $FlowFixMe
  return (
<path stroke="black" stroke={line.get(0).get('color')} strokeWidth={line.get(0).get('strokeWidth')}
    fill="none" className="path" d={pathData} />
);
}

// $FlowFixMe
export default React.forwardRef((props, ref) => <DrawArea svgRef={ref} {...props} />);
