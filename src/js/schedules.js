import React from 'react';
import Room from './room';
import { generateHalfHourIntervals } from './timeUtils';

class Schedules extends React.Component {
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
              room={room}
              intervals={intervals}
              roomDeleted={this.props.roomDeleted}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Schedules;
