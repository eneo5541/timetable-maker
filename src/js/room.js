import React from 'react';
import Event from './event';
import { HALF_HOUR, formatAMPM } from './timeUtils';

class Room extends React.Component {
  state = {
    events: [],
    editEvent: undefined,
    hoverTime: undefined,
    hexColor: '#'+Math.floor(Math.random()*16777215).toString(16),
  }

  toggleEvent = (event, time) => {
    const element = event.target;
    if (this.state.editEvent) {
      const newCoords = this.state.editEvent.coords.concat([element.offsetLeft]).sort((a, b) => a - b);
      const newTimes = this.state.editEvent.times.concat([time]).sort((a, b) => a - b);
      const newEvent = Object.assign({}, this.state.editEvent, { times: newTimes, coords: newCoords });
      this.setState({ 
        events: this.state.events.concat([newEvent]),
        editEvent: undefined,
        hoverTime: undefined,
      });
    } else {
      const newEvent = {
        id: `${this.props.roomId}-event-${new Date().getTime()}`,
        times: [ time ],
        coords: [ element.offsetLeft ],
        width: element.offsetWidth,
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

  render() {
    console.log('intervals: ', this.props.intervals.length);

    const eventsDom = [];

    if (this.props.intervals && this.state.events.length) {
      let sortedEvents = this.state.events.sort((a, b) => a.times[0] - b.times[0]);
      let currentEvent = sortedEvents.shift();
      this.props.intervals.forEach(interval => {
        if (!currentEvent || interval.value < currentEvent.times[0]) {
          eventsDom.push({ className: 'test-event' });
        } else if (interval.value <= currentEvent.times[1]) {
          if (interval.value === currentEvent.times[0]) {
            eventsDom.push({ className: 'test-event active-event', flex: (((currentEvent.times[1] - currentEvent.times[0]) / HALF_HOUR) + 1) });
          }
          if (interval.value === currentEvent.times[1]) {
            currentEvent = sortedEvents.shift();
          }
        }
      });
    }

    console.log(eventsDom.length);

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
            <div
              key={interval.value}
              className={`timetable-time`}
              onClick={(event) => this.toggleEvent(event, interval.value)}
              onMouseOver={() => this.mouseOverHandler(interval.value)}
            >
              {this.displayHover(interval.value) && 
                <div className="timetable-time-hover-overlay" />
              }
            </div>
          ))}
{/*
          <div className="timetable-schedules-room-events">
            {this.state.events.map(event => (
              <Event
                key={event.id}
                color={this.state.hexColor}
                eventDeleted={this.eventDeleted.bind(this)}
                {...event}
              >
              </Event>
            ))}
          </div>
*/}
        </div>

        <div className="events-wrapper">
          {eventsDom.map(dom => (
            <div className={dom.className} style={{ flex: dom.flex }} />
          ))}
        </div>

      </div>
    );
  }
}

export default Room;
