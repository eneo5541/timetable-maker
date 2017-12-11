import React from 'react';

class Event extends React.Component {
  state = {
    label: undefined,
    editLabel: true,
  }

  keyPressed = (key) => {
    if(key.charCode === 13) {
      this.labelAdded();
    }
  }

  labelAdded = () => {
    this.setState({ label: this.labelInput.value || 'Generic event', editLabel: false });
  }

  editLabel = () => {
    if(!this.state.editLabel) {
      this.setState({ editLabel: true });
    }
  }

  eventDeleted = (event) => {
    event.stopPropagation();
    this.props.eventDeleted(this.props.id);
  }

  render() {
    const styles = {
      left: this.props.coords[0],
      width: this.props.coords[1] - this.props.coords[0] + this.props.width,
      backgroundColor: this.props.color,
    };

    console.log(this.props.startInterval);

    return (
      <div
        className="timetable-schedules-room-event"
        style={styles}
        onClick={this.editLabel.bind(this)}
      >
        {this.state.editLabel &&
          <span>
            <input
              id="roomName"
              type="text"
              defaultValue={this.state.label}
              ref={(input) => { this.labelInput = input; }}
              onKeyPress={this.keyPressed.bind(this)}
            />
            <button className="timetable-toggle-button" onClick={this.labelAdded.bind(this)}>
              <span role="img" aria-label="confirm label">&#9989;</span>
            </button>
          </span>
        }
        {!this.state.editLabel &&
          <span>
            {this.state.label}
            <button className="timetable-toggle-button" onClick={this.eventDeleted}>
              <span role="img" aria-label="delete event">&#10062;</span>
            </button>
          </span>
        }
      </div>
    );
  }
}

export default Event;
