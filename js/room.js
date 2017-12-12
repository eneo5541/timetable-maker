import React from 'react';
import Event from './event';
import Timeslot from './timeslot';
import { HALF_HOUR } from './timeUtils';

class Room extends React.Component {
  state = {
    events: [],
    editEvent: undefined,
    hoverTime: undefined,
    hexColor: '#'+Math.floor(Math.random()*16777215).toString(16),
  }

  getEventElements = (intervals, events) => {
    let eventElements = [];
    if (intervals && events.length) {
      let currentEventIndex = 0;
      intervals.forEach(interval => {
        let currentEvent = events[currentEventIndex];
        if (!currentEvent || interval.value < currentEvent.times[0]) {
          eventElements.push(<div key={Math.random()} className="timetable-schedules-room-event-placeholder" />);
        } else if (interval.value <= currentEvent.times[1]) {
          if (interval.value === currentEvent.times[0]) {
            eventElements.push(
              <Event
                key={currentEvent.id}
                color={this.state.hexColor}
                eventDeleted={this.eventDeleted.bind(this)}
                size={((currentEvent.times[1] - currentEvent.times[0]) / HALF_HOUR) + 1}
                {...currentEvent}
              />
            );
          }
          if (interval.value === currentEvent.times[1]) {
            currentEventIndex++;
          }
        }
      });
    }

    return eventElements;
  }

  toggleEvent = (event, time) => {
    if (this.state.editEvent) {
      const newTimes = this.state.editEvent.times.concat([time]).sort((a, b) => a - b);
      const newEvent = Object.assign({}, this.state.editEvent, { times: newTimes });
      this.setState({ 
        events: this.state.events.concat([newEvent]).sort((a, b) => a.times[0] - b.times[0]),
        editEvent: undefined,
        hoverTime: undefined,
      });
    } else {
      const newEvent = {
        id: `${this.props.roomId}-event-${new Date().getTime()}`,
        times: [ time ],
      };
      this.setState({ editEvent: newEvent });
    }
  }

  eventDeleted = (eventId) => {
    this.setState({ events: this.state.events.filter(event => event.id !== eventId) });
  }

  mouseOverHandler = (interval) => {
    if (this.state.editEvent) {
      this.setState({ hoverTime: interval });
    }
  }

  displayHover = (interval) => {
    if (this.state.editEvent) {
      const times = [this.state.editEvent.times[0], this.state.hoverTime].sort((a, b) => a - b);
      if (interval >= times[0] && interval <= times[1]) {
        return true;
      }
    }
    return false;
  }

  eventsChanged = (newEvent, newTime) => {
    const timeDifference = newTime - newEvent.times[0];
    const newTimes = newEvent.times.map(time => time += timeDifference);
    const timeConflicts = this.state.events
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
      const existingEvent = this.state.events.find(event => event.id === newEvent.id);
      existingEvent.times = newTimes;
      this.setState({ events: this.state.events.sort((a, b) => a.times[0] - b.times[0]) });
    }
  }

  render() {
    return (
      <div className="timetable-room">
        <div className="timetable-room-label">
          {this.props.room.label}
          <button className="timetable-toggle-button" onClick={() => this.props.roomDeleted(this.props.room)}>
            <span role="img" aria-label="delete room">&#10062;</span>
          </button>
        </div>

        <div className="timetable-schedules-time-labels">
          {this.props.intervals.map(interval => (
            <Timeslot
              key={interval.value}
              handleClick={this.toggleEvent}
              handleMouseOver={this.mouseOverHandler}
              isHovering={this.displayHover(interval.value)}
              moveEvent={this.eventsChanged}
              {...interval}
            />
          ))}
        </div>

        <div className="timetable-schedules-room-event-wrapper">
          {this.getEventElements(this.props.intervals, this.state.events)}
        </div>

      </div>
    );
  }
}

export default Room;
