import React from 'react';

class Timeslot extends React.Component {
  allowDrag = (event) => {
    event.preventDefault();
  }

  onDrop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    this.props.moveEvent(JSON.parse(data), this.props.value);
  }

  render() {
    return (
      <div
        className="timetable-time"
        onClick={(event) => this.props.handleClick(event, this.props.value)}
        onMouseOver={() => this.props.handleMouseOver(this.props.value)}
        onDragOver={this.allowDrag}
        onDrop={this.onDrop}
      >
        {(this.props.isHovering) && 
          <div className="timetable-time-hover-overlay" />
        }
      </div>
    );
  }
}

export default Timeslot;
