import React, { Component } from 'react';

class Input extends Component {
  render() {
    return (
      <div className={'form-group ' + (this.props.wrapperAdditionalClasses ? this.props.wrapperAdditionalClasses : '')}>
        <label htmlFor={this.props.inputId}>{this.props.label}</label>
        <input
          type={this.props.inputType}
          id={this.props.inputId}
          onChange={this.props.onChange}
          className={(this.props.inputType !== 'file' ? 'form-control ' : 'form-control-file ') + (this.props.additionalClasses ? this.props.additionalClasses : '')}
          placeholder={this.props.inputPlaceholder}
          value={this.props.value}
        />
        <small className='form-text text-muted'>{this.props.belowMessage}</small>
      </div>
    );
  }
}

export default Input;
