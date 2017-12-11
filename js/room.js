import React from 'react';
import Event from './event';
import { formatAMPM } from './timeUtils';

class Room extends React.Component {
  state = {
    events: [],
    editEvent: undefined,
    hexColor: '#'+Math.floor(Math.random()*16777215).toString(16),
  }

  eventDeleted = (eventId) => {
    this.setState({ events: this.state.events.filter(event => event.id !== eventId) });
  }

  toggleEvent = (event, time) => {
    const eventExists = this.state.events.find(event => event.startTime === time);
    const element = event.target;
    if (!eventExists) {
      if (this.state.editEvent) {
        const newCoords = this.state.editEvent.coords.concat([element.offsetLeft + element.offsetWidth]).sort((a, b) => a - b);
        const newEvent = Object.assign({}, this.state.editEvent, { finishTime: time, coords: newCoords });
        this.setState({ 
          events: this.state.events.concat([newEvent]),
          editEvent: undefined,
        });
      } else {
        const newEvent = {
          id: `${this.props.roomId}-event-${new Date().getTime()}`,
          startTime: time,
          coords: [ element.offsetLeft ],
        };
        this.setState({ editEvent: newEvent });
      }
    }
  }

  render() {
    return (
      <div className="timetable-room">
        <div className="timetable-room-label">
          {this.props.room.label}
          <button className="timetable-toggle-button" onClick={() => this.props.roomDeleted(this.props.room)}>
            &#10062;
          </button>
        </div>
        <div className="timetable-schedules-time-labels">
          {this.props.intervals.map(interval => (
            <div
              key={interval.value}
              className={`timetable-time`} 
              onClick={(event) => this.toggleEvent(event, interval.value)}
            />
          ))}

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
        </div>
      </div>
    );
  }
}

export default Room;
