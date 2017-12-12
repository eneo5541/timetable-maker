import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames'

class SettableInput extends React.Component {
  state = {
    value: this.props.value,
  }

  editInput = () => {
    this.setState({ value: undefined });
  }

  keyPressed = (key) => {
    if(key.charCode === 13) {
      this.setState({ value: this.inputField.value });
      this.props.updateValue(this.inputField.value);
    }
  }

  render() {
    return (
      <div className={classnames('timetable-input', { [`${this.props.className}`]: this.props.className })}>
        {this.state.value && 
          <div onClick={this.editInput}>
            {this.state.value}
          </div>
        }
        {!this.state.value && 
          <input 
            id="settable-input"
            type="text"
            placeholder={this.props.placeholder}
            onKeyPress={this.keyPressed.bind(this)}
            ref={(input) => { this.inputField = input; }}
          />
        }
      </div>
    );
  }
}

SettableInput.propTypes = {
  className: PropTypes.string,
  updateValue: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
};

SettableInput.defaultProps = {
  className: undefined,
  updateValue: () => {},
  placeholder: undefined,
}

export default SettableInput;
