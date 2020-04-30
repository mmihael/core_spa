import React, { Component } from 'react';
import ReactSelect from 'react-select';

class Select extends Component {
  render() {
    return (
      <div className='form-group'>
        <label htmlFor={this.props.inputId}>{this.props.label}</label>
        <ReactSelect
          theme={theme => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary: '#2f4050',
              primary25: '#f3f3f4'
            }
          })}
          id={this.props.inputId}
          value={this.props.value}
          onChange={this.props.onChange}
          options={this.props.options}
          isMulti={this.props.isMulti}
          isClearable={this.props.isClearable}
        />
        <small className='form-text text-muted'>{this.props.belowMessage}</small>
      </div>
    );
  }
}

export default Select;
