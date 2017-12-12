import React from 'react';

class Event extends React.Component {
  state = {
    label: this.props.label,
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

  drag = (event) => {
    event.dataTransfer.setData("text", JSON.stringify(Object.assign({}, this.props, this.state)));
  }

  render() {
    const styles = {
      backgroundColor: this.props.color,
      flex: this.props.size,
    };

    return (
      <div
        className="timetable-schedules-room-event"
        style={styles}
        onClick={this.editLabel.bind(this)}
        onDragStart={this.drag}
        draggable
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
