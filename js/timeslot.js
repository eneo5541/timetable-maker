import React from 'react';
import PropTypes from 'prop-types';

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
        {(this.props.isSelected) && 
          <div className="timetable-time-hover-overlay" />
        }
      </div>
    );
  }
}

Timeslot.propTypes = {
  value: PropTypes.number.isRequired,
  isSelected: PropTypes.bool,
  handleClick: PropTypes.func,
  handleMouseOver: PropTypes.func,
};

Timeslot.defaultProps = {
  isSelected: false,
  handleClick: () => {},
  handleMouseOver: () => {},
}

export default Timeslot;
