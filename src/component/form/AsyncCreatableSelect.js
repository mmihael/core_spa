import React, { Component } from 'react';
import ReactAsyncCreatableSelect from 'react-select/async-creatable';

class AsyncCreatableSelect extends Component {
  render() {
    return (
      <div className='form-group'>
        <label htmlFor={this.props.inputId}>{this.props.label}</label>
        <ReactAsyncCreatableSelect
          value={this.props.value}
          onChange={this.props.onChange}
          defaultOptions={this.props.defaultOptions}
          loadOptions={this.props.loadOptions}
          isClearable={this.props.isClearable}
        />
        <small className='form-text text-muted'>{this.props.belowMessage}</small>
      </div>
    );
  }
}

export default AsyncCreatableSelect;
