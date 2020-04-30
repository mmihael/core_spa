import React, { Component } from 'react';

class Checkbox extends Component {
  render() {
    return (
      <div className='form-group form-check'>
        <input
          type='checkbox'
          className='form-check-input'
          id={this.props.inputId}
          checked={this.props.checked}
          onChange={this.props.onChange}
        />
        <label className='form-check-label' htmlFor={this.props.inputId}>{this.props.label}</label>
        <small className='form-text text-muted'>{this.props.belowMessage}</small>
      </div>
    );
  }
}

export default Checkbox;
