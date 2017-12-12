import React from 'react';
import Select from 'react-select';
import Schedules from './schedules';
import { BASE_TIME, HALF_HOUR, generateHalfHourIntervals } from './timeUtils';

class Timetable extends React.Component {
  state = {
    startTime: BASE_TIME + (HALF_HOUR * 18),
    finishTime: BASE_TIME + (HALF_HOUR * 42),
    rooms: [{
      id: 'room-12345',
      label: 'the room',
    }, {
      id: 'room-67890',
      label: 'conference room 1',
    }, {
      id: 'room-10111',
      label: 'main stages',
    }],
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
    const newRoom = {
      id: `room-${new Date().getTime()}`,
      label: this.newRoomInput.value,
    };
    this.setState({ rooms: this.state.rooms.concat([newRoom]) });
    this.newRoomInput.value = "";
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
          Set start time:
          <Select
            className="timetable-time-dropdown"
            value={this.state.startTime}
            onChange={this.startTimeChanged.bind(this)}
            options={startTimes}
          />
          Set finish time:
          <Select
            className="timetable-time-dropdown"
            value={this.state.finishTime}
            onChange={this.finishTimeChanged.bind(this)}
            options={finishTimes}
          />
          <input id="roomName" type="text" ref={(input) => { this.newRoomInput = input; }} />
          <button onClick={this.roomAdded.bind(this)}>Add room</button>
        </div>
        <Schedules
          startTime={this.state.startTime}
          finishTime={this.state.finishTime}
          rooms={this.state.rooms}
          roomDeleted={this.roomDeleted.bind(this)}
        />
      </div>
    );
  }
}

export default Timetable;
