import React, { Component } from 'react';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class DatePicker extends Component {
  render() {
    return (
      <div className='form-group'>
        <label className='form-label' htmlFor={this.props.inputId}>{this.props.label}</label><br />
        <ReactDatePicker
          className='form-control'
          dateFormat='dd.MM.yyyy'
          selected={this.props.selected}
          onChange={this.props.onChange}
        />
        <small className='form-text text-muted'>{this.props.belowMessage}</small>
      </div>
    );
  }
}

export default DatePicker;
