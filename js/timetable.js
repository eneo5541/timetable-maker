import React from 'react';
import Select from 'react-select';

const BASE_TIME = new Date('12/01/1989').getTime();
const HALF_HOUR = 1800000;
const ONE_DAY = 84600000;

class Timetable extends React.Component {
  state = {
    startTime: BASE_TIME + (1800000 * 18),
    finishTime: BASE_TIME + (1800000 * 42),
    selectedOption: '',
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

  formatAMPM = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${date.getHours() >= 12 ? 'pm' : 'am'}`;
  }

  generateHalfHourIntervals = (startTime) => {
    const intervals = [];
    let nextTime = 0;
    let i = 0;
    while (nextTime < (BASE_TIME + ONE_DAY)) {
      nextTime = startTime + (HALF_HOUR * i);
      intervals.push({ 
        value: nextTime,
        label: this.formatAMPM(nextTime),
      });
      i++;
    }

    return intervals;
  }

  render() {
    const startTimes = this.generateHalfHourIntervals(BASE_TIME);
    const finishTimes = this.generateHalfHourIntervals(this.state.startTime);
    console.log(`starting at ${this.formatAMPM(this.state.startTime)}, ending at ${this.formatAMPM(this.state.finishTime)}`);
    return (
      <div className="timetable">
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
      </div>
    );
  }
}

export default Timetable;
