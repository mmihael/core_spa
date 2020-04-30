import React, { Component } from 'react';
import ReactCreatableSelect from 'react-select/creatable';

class Select extends Component {
  render() {
    return (
      <div className='form-group'>
        <label htmlFor={this.props.inputId}>{this.props.label}</label>
        <ReactCreatableSelect
          value={this.props.value}
          onChange={this.props.onChange}
          options={this.props.options}
          isClearable={this.props.isClearable}
        />
        <small className='form-text text-muted'>{this.props.belowMessage}</small>
      </div>
    );
  }
}

export default Select;
