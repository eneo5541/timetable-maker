import React from 'react';
import PropTypes from 'prop-types';
import Room from './room';
import { generateHalfHourIntervals } from './timeUtils';

class Schedules extends React.Component {
  state = {
    events: this.props.rooms.reduce((map, obj) => {
      map[obj.id] = [];
      return map;
    }, {})
  }

  updateEvents = (newEvents, roomId) => {
    const events = this.state.events;

    newEvents.forEach(newEvent => {
      if (newEvent.roomId !== roomId) {
        events[newEvent.roomId] = events[newEvent.roomId].filter(event => event.id !== newEvent.id);
        newEvent.roomId = roomId;
      }
    });
    
    events[roomId] = newEvents;

    this.setState({ events });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rooms !== this.props.rooms) {
      const events = this.state.events;
      nextProps.rooms.forEach(newRoom => {
        const roomExists = Object.keys(this.state.events).find(key => key === newRoom.id);
        if (!roomExists) {
          events[newRoom.id] = [];
        }
      });
      this.setState({ events });
    }
  }

  render() {
    const intervals = generateHalfHourIntervals(this.props.startTime, this.props.finishTime);
    return (
      <div className="timetable-schedules">
        <div className="timetable-schedules-time-labels">
          {intervals.map(interval => (
            <div key={interval.value} className={`timetable-time`}>
              {interval.label}
            </div>
          ))}
        </div>
        <div className="timetable-schedules-time-slots">
          {this.props.rooms.map(room => (
            <Room
              key={room.id}
              roomId={room.id}
              events={this.state.events[room.id]}
              intervals={intervals}
              updateEvents={this.updateEvents}
              roomDeleted={this.props.roomDeleted}
              {...room}
            />
          ))}
          <div className="timetable-schedules-add-room">
            <button onClick={this.props.roomAdded}>
              <span role="img" aria-label="add room">&#10010;</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Schedules.propTypes = {
  startTime: PropTypes.number.isRequired,
  finishTime: PropTypes.number.isRequired,
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
  roomDeleted: PropTypes.func,
  roomAdded: PropTypes.func,
};

Schedules.defaultProps = {
  roomDeleted: () => {},
  roomAdded: () => {},
}

export default Schedules;
