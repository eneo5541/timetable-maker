import React from 'react';
import PropTypes from 'prop-types';
import SettableInput from './settable-input';

class Event extends React.Component {
  state = {
    label: this.props.label,
  }

  setLabel = (label) => {
    this.setState({ label });
  }

  drag = (event) => {
    event.dataTransfer.setData("text", JSON.stringify(Object.assign({}, this.props, this.state)));
  }

  render() {
    const styles = {
      backgroundColor: this.props.color,
      flex: this.props.size,
    };

    return (
      <div
        className="timetable-schedules-room-event-active"
        style={styles}
        onDragStart={this.drag}
        draggable
      >
        <SettableInput
          className="timetable-schedules-room-event-input-label"
          placeholder="Event name"
          value={this.state.label}
          updateValue={this.setLabel}
        />

        <span>
          <button className="timetable-toggle-button" onClick={() => this.props.eventDeleted(this.props.id)}>
            <span role="img" aria-label="delete event">&#10006;</span>
          </button>
        </span>
      </div>
    );
  }
}

Event.propTypes = {
  label: PropTypes.string,
  editLabel: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.number,
  eventDeleted: PropTypes.func,
};

Event.defaultProps = {
  label: undefined,
  editLabel: true,
  color: '#99ff00',
  size: 1,
  eventDeleted: () => {},
}

export default Event;
