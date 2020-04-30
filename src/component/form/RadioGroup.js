import React, { Component } from 'react';

class RadioGroup extends Component {
  render() {
    return (
      <div className='form-group'>
        <label>{this.props.label}</label>
        {this.props.options.map(option => (
          <div className='form-check' key={option.label}>
            <label>
              <input
                type='radio'
                name={this.props.name}
                checked={option === this.props.value ? true : false}
                className='form-check-input'
                onChange={e => { this.props.onChange(option); }}
              />
              {option.label}
            </label>
          </div>
        ))}
      </div>
    );
  }
}

export default RadioGroup;
