import React from 'react';
import Select from 'react-select';
import Schedules from './schedules';
import SettableInput from './settable-input';
import { BASE_TIME, HALF_HOUR, generateHalfHourIntervals } from './timeUtils';

class Timetable extends React.Component {
  state = {
    tableTitle: undefined,
    startTime: BASE_TIME + (HALF_HOUR * 18),
    finishTime: BASE_TIME + (HALF_HOUR * 42),
    rooms: [{
      id: 'room-12345',
      label: 'the room',
    }],
  }

  editTitle = () => {
    this.setState({ tableTitle: undefined });
  }

  startTimeChanged = (event) => {
    if (event) {
      this.setState({ startTime: event.value });
    }
  }

  finishTimeChanged = (event) => {
    if (event) {
      this.setState({ finishTime: event.value });
    }
  }

  roomAdded = () => {
    const newRoom = { id: `room-${new Date().getTime()}` };
    this.setState({ rooms: this.state.rooms.concat([newRoom]) });
  }  

  roomDeleted = (newRoom) => {
    this.setState({ rooms: this.state.rooms.filter(room => room.id !== newRoom.id) });
  }

  render() {
    const startTimes = generateHalfHourIntervals(BASE_TIME);
    const finishTimes = generateHalfHourIntervals(this.state.startTime);
    return (
      <div className="timetable">
        <div className="timetable-controls">
          <SettableInput className="timetable-title" placeholder="Name of schedule" />
          <div className="timetable-time-selections">
            <Select
              className="timetable-time-dropdown"
              value={this.state.startTime}
              onChange={this.startTimeChanged.bind(this)}
              options={startTimes}
            />
            <Select
              className="timetable-time-dropdown"
              value={this.state.finishTime}
              onChange={this.finishTimeChanged.bind(this)}
              options={finishTimes}
            />
          </div>
        </div>
        <Schedules
          startTime={this.state.startTime}
          finishTime={this.state.finishTime}
          rooms={this.state.rooms}
          roomDeleted={this.roomDeleted.bind(this)}
          roomAdded={this.roomAdded.bind(this)}
        />
      </div>
    );
  }
}

export default Timetable;
