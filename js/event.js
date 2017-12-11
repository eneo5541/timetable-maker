import React from 'react';

class Event extends React.Component {
  state = {
    label: undefined,
    editLabel: true,
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
      width: this.props.coords[1] - this.props.coords[0],
      backgroundColor: this.props.color,
    };

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
            />
            <button className="timetable-toggle-button" onClick={this.labelAdded.bind(this)}>
              &#9989;
            </button>
          </span>
        }
        {!this.state.editLabel &&
          <span>
            {this.state.label}
            <button className="timetable-toggle-button" onClick={this.eventDeleted}>
              &#10062;
            </button>
          </span>
        }
      </div>
    );
  }
}

export default Event;
