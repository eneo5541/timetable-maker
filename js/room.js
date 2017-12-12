import React from 'react';
import PropTypes from 'prop-types';
import EventContainer from './event-container';
import Timeslot from './timeslot';
import SettableInput from './settable-input';

class Room extends React.Component {
  state = {
    label: this.props.label,
    editEvent: undefined,
    selectedTime: undefined,
    hexColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
  }

  setLabel = (label) => {
    this.setState({ label });
  }

  updateEvents = (events) => {
    const sortedEvents = events.sort((a, b) => a.times[0] - b.times[0])
    this.props.updateEvents(sortedEvents, this.props.roomId);
  }

  createEvent = (event, time) => {
    if (this.state.editEvent) {
      const newTimes = this.state.editEvent.times.concat([time]).sort((a, b) => a - b);
      const newEvent = Object.assign({}, this.state.editEvent, { times: newTimes });
      this.setState({ 
        editEvent: undefined,
        selectedTime: undefined,
      });
      this.updateEvents(this.props.events.concat([newEvent]));
    } else {
      const newEvent = {
        id: `${this.props.roomId}-event-${new Date().getTime()}`,
        roomId: this.props.roomId,
        times: [ time ],
      };
      this.setState({ editEvent: newEvent });
    }
  }

  eventDeleted = (eventId) => {
    this.updateEvents(this.props.events.filter(event => event.id !== eventId));
  }

  setSelectedTime = (interval) => {
    if (this.state.editEvent) {
      this.setState({ selectedTime: interval });
    }
  }

  highlightSelectedTimes = (interval) => {
    if (this.state.editEvent) {
      const times = [this.state.editEvent.times[0], this.state.selectedTime].sort((a, b) => a - b);
      if (interval >= times[0] && interval <= times[1]) {
        return true;
      }
    }
    return false;
  }

  changeEventTimes = (newEvent, newTime) => {
    const timeDifference = newTime - newEvent.times[0];
    const newTimes = newEvent.times.map(time => time += timeDifference);
    const timeConflicts = this.props.events
      .filter(event => event.id !== newEvent.id)
      .reduce((conflict, event) => {
        if (conflict ||
          (newTimes[0] >= event.times[0] && newTimes[0] <= event.times[1]) ||
          (newTimes[1] >= event.times[0] && newTimes[1] <= event.times[1])) {
          return true;
        }
        return false;
      }, false
    );

    if (!timeConflicts) {
      let existingEvent = this.props.events.find(event => event.id === newEvent.id)
      if (existingEvent) {
        existingEvent.times = newTimes;
        this.updateEvents(this.props.events);
      } else {
        newEvent.times = newTimes;
        newEvent.color = this.state.hexColor;
        this.updateEvents(this.props.events.concat([newEvent]));
      }
    }
  }

  render() {
    return (
      <div className="timetable-room">
        <div className="timetable-room-label">
          <SettableInput
            className="timetable-room-input-label"
            placeholder="Name of room"
            value={this.props.label}
            updateValue={this.setLabel}
          />
          <span>
            <button className="timetable-toggle-button" onClick={() => this.props.roomDeleted(this.props)}>
              <span role="img" aria-label="delete room">&#10006;</span>
            </button>
          </span>
        </div>

        <div className="timetable-schedules-time-labels">
          {this.props.intervals.map(interval => (
            <Timeslot
              key={interval.value}
              handleClick={this.createEvent}
              handleMouseOver={this.setSelectedTime}
              isSelected={this.highlightSelectedTimes(interval.value)}
              moveEvent={this.changeEventTimes}
              {...interval}
            />
          ))}
        </div>
        <EventContainer 
          intervals={this.props.intervals}
          events={this.props.events}
          hexColor={this.state.hexColor}
          eventDeleted={this.eventDeleted}
        />
      </div>
    );
  }
}

Room.propTypes = {
  roomId: PropTypes.string.isRequired,
  label: PropTypes.string,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  intervals: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateEvents: PropTypes.func,
  roomDeleted: PropTypes.func,
};

Timeslot.defaultProps = {
  label: undefined,
  updateEvents: () => {},
  roomDeleted: () => {},
}


export default Room;
