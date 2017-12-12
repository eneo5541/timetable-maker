import React from 'react';
import PropTypes from 'prop-types';
import Event from './event';
import { HALF_HOUR } from './timeUtils';

class EventContainer extends React.Component {
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
                color={this.props.hexColor}
                eventDeleted={this.props.eventDeleted.bind(this)}
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

  render() {
    return (
      <div className="timetable-schedules-room-event-wrapper">
        {this.getEventElements(this.props.intervals, this.props.events)}
      </div>
    );
  }
}

EventContainer.propTypes = {
  hexColor: PropTypes.string,
  intervals: PropTypes.arrayOf(PropTypes.object).isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  eventDeleted: PropTypes.func,
};

EventContainer.defaultProps = {
  hexColor: '#99ff00',
  eventDeleted: () => {},
}

export default EventContainer;
