import React, { Component } from 'react';

class Textarea extends Component {
  render() {
    return (
      <div className='form-group'>
        <label htmlFor={this.props.inputId}>{this.props.label}</label>
        <textarea
          id={this.props.inputId}
          onChange={this.props.onChange}
          className='form-control'
          placeholder={this.props.placeholder}
          value={this.props.value}
          rows={this.props.rows ? this.props.rows : 8}
        ></textarea>
        <small className='form-text text-muted'>{this.props.belowMessage}</small>
      </div>
    );
  }
}

export default Textarea;
