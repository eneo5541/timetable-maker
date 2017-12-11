import React from 'react';
import Event from './event';

class Room extends React.Component {
  state = {
    events: [],
    editEvent: undefined,
    hoverTime: undefined,
    hexColor: '#'+Math.floor(Math.random()*16777215).toString(16),
  }

  toggleEvent = (event, time) => {
    const eventExists = this.state.events.find(event => event.startTime === time);
    const element = event.target;
    if (!eventExists) {
      if (this.state.editEvent) {
        const newCoords = this.state.editEvent.coords.concat([element.offsetLeft]).sort((a, b) => a - b);
        const newEvent = Object.assign({}, this.state.editEvent, { finishTime: time, coords: newCoords });
        this.setState({ 
          events: this.state.events.concat([newEvent]),
          editEvent: undefined,
          hoverTime: undefined,
        });
      } else {
        const newEvent = {
          id: `${this.props.roomId}-event-${new Date().getTime()}`,
          startTime: time,
          coords: [ element.offsetLeft ],
          width: element.offsetWidth,
        };
        this.setState({ editEvent: newEvent });
      }
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
      const times = [this.state.editEvent.startTime, this.state.hoverTime].sort((a, b) => a - b);
      if (interval >= times[0] && interval <= times[1]) {
        return true;
      }
    }
    return false;
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
