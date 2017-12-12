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
};

Schedules.defaultProps = {
  roomDeleted: () => {},
}

export default Schedules;
